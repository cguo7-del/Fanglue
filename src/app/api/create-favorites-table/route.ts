import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 验证用户身份
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 创建收藏表的SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(50),
        selected_books JSONB DEFAULT '[]'::jsonb,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, question)
      );
    `;

    // 创建索引的SQL
    const createIndexesSQL = [
      'CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_favorites_category ON favorites(category);',
      'CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);'
    ];

    // 创建RLS策略的SQL
    const createRLSSQL = [
      'ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;',
      `CREATE POLICY IF NOT EXISTS "Users can view own favorites" ON favorites
        FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can insert own favorites" ON favorites
        FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can update own favorites" ON favorites
        FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can delete own favorites" ON favorites
        FOR DELETE USING (auth.uid() = user_id);`
    ];

    // 执行创建表的SQL
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });

    if (tableError) {
      console.error('创建表失败:', tableError);
      return NextResponse.json(
        { error: '创建收藏表失败', details: tableError.message },
        { status: 500 }
      );
    }

    // 执行创建索引的SQL
    for (const indexSQL of createIndexesSQL) {
      const { error: indexError } = await supabase.rpc('exec_sql', {
        sql: indexSQL
      });
      if (indexError) {
        console.warn('创建索引警告:', indexError);
      }
    }

    // 执行创建RLS策略的SQL
    for (const rlsSQL of createRLSSQL) {
      const { error: rlsError } = await supabase.rpc('exec_sql', {
        sql: rlsSQL
      });
      if (rlsError) {
        console.warn('创建RLS策略警告:', rlsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: '收藏表创建成功',
      table: 'favorites'
    });

  } catch (error) {
    console.error('Create Favorites Table API Error:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}