-- =====================================================
-- DADOS INICIAIS PARA TESTES
-- =====================================================
-- Este arquivo é executado após as migrações
-- Use para inserir dados de teste e configurações iniciais

-- Inserir dados de exemplo apenas se não existirem já
-- (útil para desenvolvimento e testes)

-- Dados de categoria e condições para referência no frontend
-- Nota: No frontend, use enums baseados nestas opções

-- Categorias disponíveis:
-- 'eletronicos', 'livros', 'material_escolar', 'moveis', 'esportes', 'moda', 'outros'

-- Condições disponíveis:
-- 'novo', 'usado_otimo', 'usado_bom', 'usado_regular'

-- Campus disponíveis:
-- 'darcy', 'fcte', 'ceilandia', 'planaltina', 'gama'

-- =====================================================
-- INSERIR USUÁRIO DE TESTE (OPCIONAL)
-- =====================================================
-- Descomente as linhas abaixo se quiser um usuário de teste
-- IMPORTANTE: Só funciona se você criar o usuário via auth primeiro!

-- INSERT INTO public.user_profiles (
--     id,
--     email, 
--     name, 
--     matricula, 
--     course, 
--     campus, 
--     bio
-- ) VALUES (
--     'test-user-uuid-here',  -- Substitua por um UUID real do auth.users
--     'teste@aluno.unb.br',
--     'Usuário de Teste',
--     '123456789',
--     'Ciência da Computação',
--     'fcte',
--     'Perfil de teste para desenvolvimento'
-- ) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PRODUTOS DE EXEMPLO (OPCIONAL)  
-- =====================================================
-- Descomente para inserir produtos de teste
-- IMPORTANTE: Só funciona se o usuário de teste existir!

-- INSERT INTO public.products (
--     title,
--     description,
--     price,
--     category,
--     condition,
--     location,
--     seller_id
-- ) VALUES 
-- (
--     'Notebook Dell Inspiron 15',
--     'Notebook em ótimo estado, 8GB RAM, SSD 256GB. Ideal para estudos e trabalho.',
--     1200.00,
--     'eletronicos',
--     'usado_otimo',
--     'Campus FCTE',
--     'test-user-uuid-here'  -- Substitua pelo UUID real
-- ),
-- (
--     'Cálculo I - James Stewart',
--     'Livro de Cálculo I do James Stewart, 8ª edição. Pouquíssimo uso, sem anotações.',
--     180.00,
--     'livros',
--     'usado_otimo',
--     'Campus FCTE',
--     'test-user-uuid-here'  -- Substitua pelo UUID real
-- ),
-- (
--     'Mesa de Estudos',
--     'Mesa de madeira para estudos, 1,20m x 0,60m. Muito resistente e espaçosa.',
--     250.00,
--     'moveis',
--     'usado_bom',
--     'Campus FCTE',
--     'test-user-uuid-here'  -- Substitua pelo UUID real
-- )
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- CONFIGURAÇÕES DE DESENVOLVIMENTO
-- =====================================================

-- Permitir todos os tipos de arquivos no storage (desenvolvimento)
-- Em produção, restrinja conforme necessário
UPDATE storage.buckets 
SET 
    file_size_limit = 52428800,  -- 50MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
WHERE id IN ('avatars', 'product-images');

-- =====================================================
-- VIEWS ÚTEIS PARA DESENVOLVIMENTO
-- =====================================================

-- View para listar produtos com informações do vendedor
CREATE OR REPLACE VIEW products_with_seller AS
SELECT 
    p.*,
    up.name as seller_name,
    up.email as seller_email,
    up.campus as seller_campus,
    up.rating as seller_rating
FROM products p
JOIN user_profiles up ON p.seller_id = up.id;

-- View para estatísticas do usuário
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    up.id,
    up.name,
    up.email,
    COUNT(p.id) as total_products,
    COALESCE(AVG(p.price), 0) as avg_product_price,
    COUNT(CASE WHEN p.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as products_last_30_days
FROM user_profiles up
LEFT JOIN products p ON up.id = p.seller_id
GROUP BY up.id, up.name, up.email;

-- =====================================================
-- FUNÇÕES ÚTEIS PARA A APLICAÇÃO
-- =====================================================

-- Função para incrementar views de um produto
CREATE OR REPLACE FUNCTION increment_product_views(product_uuid uuid)
RETURNS void AS $$
BEGIN
    UPDATE products 
    SET views = views + 1 
    WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar produtos com filtros
CREATE OR REPLACE FUNCTION search_products(
    search_term text DEFAULT '',
    category_filter text DEFAULT '',
    min_price decimal DEFAULT 0,
    max_price decimal DEFAULT 999999,
    limit_count int DEFAULT 20
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    price decimal,
    category text,
    condition text,
    location text,
    images text[],
    views int,
    seller_name text,
    seller_campus text,
    created_at timestamptz
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.category,
        p.condition,
        p.location,
        p.images,
        p.views,
        up.name as seller_name,
        up.campus as seller_campus,
        p.created_at
    FROM products p
    JOIN user_profiles up ON p.seller_id = up.id
    WHERE 
        (search_term = '' OR p.title ILIKE '%' || search_term || '%' OR p.description ILIKE '%' || search_term || '%')
        AND (category_filter = '' OR p.category = category_filter)
        AND p.price >= min_price
        AND p.price <= max_price
    ORDER BY p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;