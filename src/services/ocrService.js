import { createModel } from "../lib/pennywise/llm";
import { HumanMessage } from "@langchain/core/messages";
import * as XLSX from "xlsx";

/**
 * Converts a File object to a base64 string.
 * @param {File} file
 * @returns {Promise<string>}
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the data URL prefix
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Reads an Excel file and converts the first sheet to CSV text.
 * @param {File} file
 * @returns {Promise<string>}
 */
const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        resolve(csv);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Scans a receipt (Image, PDF, or Excel) and extracts expense information.
 * @param {File} file - The file to scan.
 * @returns {Promise<Object>} - The extracted expense data.
 */
export const scanReceipt = async (file) => {
  try {
    const model = await createModel();
    let messageContent = [];

    const basePrompt = `Analyze the provided document and extract the following information in JSON format:
    {
      "amount": number,
      "date": string (YYYY-MM-DD),
      "description": string,
      "category": string (one of: Food, Transport, Utilities, Entertainment, Health, Education, Shopping, Other)
    }
    If a field cannot be determined, return null for that field. Ensure the output is valid JSON.`;

    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      // Handle Excel files
      const csvData = await readExcelFile(file);
      messageContent = [
        {
          type: "text",
          text: `${basePrompt}\n\nHere is the data from the Excel sheet:\n${csvData}`,
        },
      ];
    } else if (file.type === "application/pdf") {
      // Handle PDF files
      const base64Data = await fileToBase64(file);
      messageContent = [
        {
          type: "text",
          text: basePrompt,
        },
        {
          type: "media",
          mime_type: "application/pdf",
          data: base64Data,
        },
      ];
    } else {
      // Handle Image files
      const base64Image = await fileToBase64(file);
      messageContent = [
        {
          type: "text",
          text: basePrompt,
        },
        {
          type: "image_url",
          image_url: `data:${file.type};base64,${base64Image}`,
        },
      ];
    }

    const message = new HumanMessage({
      content: messageContent,
    });

    const response = await model.invoke([message]);

    // Extract JSON from the response content. It might be wrapped in markdown code blocks.
    const content = response.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      console.warn("OCR Service: No JSON found in response", content);
      return {};
    }
  } catch (error) {
    console.error("OCR Service: Failed to scan receipt", error);
    throw error;
  }
};
