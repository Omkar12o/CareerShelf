-- ---------------------------------------------------------------------------
-- CareerShelf — make Admin → Products / Services able to save prices
--
-- WHY: the `products` table has Row Level Security enabled, and no INSERT /
-- UPDATE / DELETE policy existed for a signed-in user. Every "Save" was rejected
-- with:
--     new row violates row-level security policy for table "products"
-- The `product-files` storage bucket was also missing, so file uploads failed
-- with "Bucket not found" before the price could ever be written.
--
-- RUN ONCE: Supabase -> SQL Editor -> New query -> paste this whole file -> Run.
-- Safe to run again; it only creates what is missing.
-- ---------------------------------------------------------------------------

-- 1. Storage bucket that holds the PDF/ZIP files the admin uploads -----------
insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', true)
on conflict (id) do update set public = true;

-- 2. Who is the shop owner? (must match src/admin.ts) ------------------------
create or replace function public.is_careershelf_admin()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'careershelf.help@gmail.com', false)
$$;

-- 3. Storage rules: anyone may read a file by its URL, only the owner writes --
drop policy if exists "careershelf files read" on storage.objects;
create policy "careershelf files read"
  on storage.objects for select
  using (bucket_id = 'product-files');

drop policy if exists "careershelf files insert" on storage.objects;
create policy "careershelf files insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-files' and public.is_careershelf_admin());

drop policy if exists "careershelf files update" on storage.objects;
create policy "careershelf files update"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-files' and public.is_careershelf_admin())
  with check (bucket_id = 'product-files' and public.is_careershelf_admin());

drop policy if exists "careershelf files delete" on storage.objects;
create policy "careershelf files delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-files' and public.is_careershelf_admin());

-- 4. Product rules: the storefront keeps reading, only the owner may write ----
drop policy if exists "careershelf admin insert products" on public.products;
create policy "careershelf admin insert products"
  on public.products for insert to authenticated
  with check (public.is_careershelf_admin());

drop policy if exists "careershelf admin update products" on public.products;
create policy "careershelf admin update products"
  on public.products for update to authenticated
  using (public.is_careershelf_admin())
  with check (public.is_careershelf_admin());

drop policy if exists "careershelf admin delete products" on public.products;
create policy "careershelf admin delete products"
  on public.products for delete to authenticated
  using (public.is_careershelf_admin());

-- 5. Proof -------------------------------------------------------------------
select
  (select count(*) from storage.buckets where id = 'product-files') as bucket_ready,
  (select count(*) from pg_policies
     where schemaname = 'public' and tablename = 'products'
       and policyname like 'careershelf admin%') as product_write_policies,
  (select count(*) from pg_policies
     where schemaname = 'storage' and tablename = 'objects'
       and policyname like 'careershelf files%') as storage_policies;
