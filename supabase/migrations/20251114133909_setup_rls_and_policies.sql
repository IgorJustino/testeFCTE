-- Habilitar Row Level Security (RLS) nas tabelas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA - USER_PROFILES
-- =====================================================

-- Perfis são visíveis publicamente
CREATE POLICY "Perfis são visíveis publicamente" ON public.user_profiles
    FOR SELECT USING (true);

-- Usuários podem inserir seus próprios perfis
CREATE POLICY "Usuários podem inserir seus próprios perfis" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Usuários podem atualizar seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- POLÍTICAS DE SEGURANÇA - PRODUCTS
-- =====================================================

-- Produtos são visíveis publicamente
CREATE POLICY "Produtos são visíveis publicamente" ON public.products
    FOR SELECT USING (true);

-- Usuários podem inserir seus próprios produtos
CREATE POLICY "Usuários podem inserir seus próprios produtos" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Usuários podem atualizar seus próprios produtos
CREATE POLICY "Usuários podem atualizar seus próprios produtos" ON public.products
    FOR UPDATE USING (auth.uid() = seller_id);

-- Usuários podem deletar seus próprios produtos
CREATE POLICY "Usuários podem deletar seus próprios produtos" ON public.products
    FOR DELETE USING (auth.uid() = seller_id);

-- =====================================================
-- POLÍTICAS DE SEGURANÇA - MESSAGES
-- =====================================================

-- Usuários podem ver suas próprias mensagens (enviadas e recebidas)
CREATE POLICY "Usuários podem ver suas próprias mensagens" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Usuários podem enviar mensagens
CREATE POLICY "Usuários podem enviar mensagens" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Usuários podem marcar suas mensagens como lidas
CREATE POLICY "Usuários podem marcar suas mensagens como lidas" ON public.messages
    FOR UPDATE USING (auth.uid() = receiver_id);