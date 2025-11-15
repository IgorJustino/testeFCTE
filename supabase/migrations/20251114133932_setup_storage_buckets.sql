-- Criar buckets para armazenamento de arquivos
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('product-images', 'product-images', true);

-- =====================================================
-- POLÍTICAS DE STORAGE - AVATARS
-- =====================================================

-- Qualquer um pode ver avatars
CREATE POLICY "Qualquer um pode ver avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Usuários podem fazer upload de seus avatars
CREATE POLICY "Usuários podem fazer upload de seus avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Usuários podem atualizar seus avatars
CREATE POLICY "Usuários podem atualizar seus avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Usuários podem deletar seus avatars
CREATE POLICY "Usuários podem deletar seus avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- POLÍTICAS DE STORAGE - PRODUCT IMAGES
-- =====================================================

-- Qualquer um pode ver imagens de produtos
CREATE POLICY "Qualquer um pode ver imagens de produtos" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

-- Usuários autenticados podem fazer upload de imagens de produtos
CREATE POLICY "Usuários podem fazer upload de imagens de produtos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' AND 
        auth.role() = 'authenticated'
    );

-- Usuários podem atualizar imagens de seus produtos
CREATE POLICY "Usuários podem atualizar imagens de produtos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' AND 
        auth.role() = 'authenticated'
    );

-- Usuários podem deletar imagens de seus produtos
CREATE POLICY "Usuários podem deletar imagens de produtos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' AND 
        auth.role() = 'authenticated'
    );