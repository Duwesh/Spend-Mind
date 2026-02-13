-- Create a table for public profiles using Supabase Auth
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for currencies
create table currencies (
  code text primary key,
  symbol text not null,
  name text not null
);

-- Insert some default currencies
insert into currencies (code, symbol, name) values
  ('USD', '$', 'US Dollar'),
  ('EUR', '€', 'Euro'),
  ('GBP', '£', 'British Pound'),
  ('JPY', '¥', 'Japanese Yen'),
  ('INR', '₹', 'Indian Rupee'),
  ('AUD', 'A$', 'Australian Dollar'),
  ('CAD', 'C$', 'Canadian Dollar');

-- Create a table for user settings
create table settings (
  user_id uuid references auth.users not null primary key,
  currency_code text references currencies(code) default 'USD',
  country_code text,
  theme text default 'system',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table settings enable row level security;

create policy "Users can view their own settings." on settings
  for select using (auth.uid() = user_id);

create policy "Users can update their own settings." on settings
  for update using (auth.uid() = user_id);

create policy "Users can insert their own settings." on settings
  for insert with check (auth.uid() = user_id);

-- Create a table for expense categories
create table categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  type text default 'expense', -- 'expense' or 'income'
  color text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table categories enable row level security;

create policy "Users can view their own categories." on categories
  for select using (auth.uid() = user_id);

create policy "Users can insert their own categories." on categories
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own categories." on categories
  for update using (auth.uid() = user_id);

create policy "Users can delete their own categories." on categories
  for delete using (auth.uid() = user_id);

-- Create a table for expenses
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  category_id uuid references categories(id), -- Optional link to strict category
  category_name text, -- Fallback for legacy/simple categories
  date date not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table expenses enable row level security;

create policy "Users can view their own expenses." on expenses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own expenses." on expenses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own expenses." on expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own expenses." on expenses
  for delete using (auth.uid() = user_id);

-- Create a table for financial goals
create table goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline date,
  months integer, -- Alternative to deadline
  type text default 'saving',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table goals enable row level security;

create policy "Users can view their own goals." on goals
  for select using (auth.uid() = user_id);

create policy "Users can insert their own goals." on goals
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own goals." on goals
  for update using (auth.uid() = user_id);

create policy "Users can delete their own goals." on goals
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  insert into public.settings (user_id)
  values (new.id);
  
  -- Insert default categories for the user
  insert into public.categories (user_id, name, type) values
  (new.id, 'Food', 'expense'),
  (new.id, 'Transport', 'expense'),
  (new.id, 'Utilities', 'expense'),
  (new.id, 'Entertainment', 'expense'),
  (new.id, 'Health', 'expense');
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
