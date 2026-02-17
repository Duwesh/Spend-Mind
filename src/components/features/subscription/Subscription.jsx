import { useState } from "react";
import { Check, X, Zap, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const Subscription = () => {
  const [isYearly, setIsYearly] = useState(false);

  const features = {
    free: [
      { name: "Expense Tracking", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Monthly Budgets", included: true },
      { name: "5 OCR Scans/mo", included: true },
      { name: "AI Financial Advisor", included: false },
      { name: "Export to CSV/PDF", included: false },
      { name: "Unlimited History", included: false },
    ],
    pro: [
      { name: "Expense Tracking", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Unlimited Budgets", included: true },
      { name: "Unlimited OCR Scans", included: true },
      { name: "AI Financial Advisor", included: true },
      { name: "Export to CSV/PDF", included: true },
      { name: "Unlimited History", included: true },
    ],
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Upgrade your Financial Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of Spend Mind with our Pro plan.
          Get AI insights, unlimited scans, and more.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              isYearly ? 'bg-cyan-500' : 'bg-slate-600'
            }`}
          >
            <span
              className={`${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly <span className="text-xs text-green-500 font-bold">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full border-border bg-card/50 backdrop-blur-sm relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="w-6 h-6 text-slate-400" />
                Free
              </CardTitle>
              <CardDescription>Essential features for beginners</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.free.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative"
        >
           <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 opacity-75 blur-sm" />
          <Card className="h-full border-transparent bg-slate-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-cyan-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              RECOMMENDED
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <Crown className="w-6 h-6 text-yellow-400" />
                Pro
              </CardTitle>
              <CardDescription className="text-slate-300">Power tools for serious tracking</CardDescription>
              <div className="mt-4 text-white">
                <span className="text-4xl font-bold">
                    {isYearly ? "$99" : "$9.99"}
                </span>
                <span className="text-slate-400">/{isYearly ? "year" : "month"}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.pro.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-white">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
              >
                <Zap className="w-4 h-4 mr-2 fill-current" />
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;
