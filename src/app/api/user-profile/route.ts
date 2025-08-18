import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function createSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
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
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 获取用户资料
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 是没有找到记录的错误
      console.error('获取用户资料失败:', error);
      return NextResponse.json({ error: '获取用户资料失败' }, { status: 500 });
    }

    // 如果没有找到资料，返回默认值
    if (!profile) {
      return NextResponse.json({
        profile: {
          user_id: user.id,
          email: user.email,
          display_name: '',
          bio: '',
          avatar_url: '',
          preferences: {
            favorite_categories: [],
            notification_settings: {
              email_notifications: true,
              push_notifications: false
            }
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, bio, avatar_url, preferences } = body;

    // 创建或更新用户资料
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        display_name: display_name || '',
        bio: bio || '',
        avatar_url: avatar_url || '',
        preferences: preferences || {
          favorite_categories: [],
          notification_settings: {
            email_notifications: true,
            push_notifications: false
          }
        },
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('更新用户资料失败:', error);
      return NextResponse.json({ error: '更新用户资料失败' }, { status: 500 });
    }

    return NextResponse.json({ profile, message: '资料更新成功' });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, bio, avatar_url, preferences } = body;

    // 更新用户资料
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({
        display_name: display_name !== undefined ? display_name : undefined,
        bio: bio !== undefined ? bio : undefined,
        avatar_url: avatar_url !== undefined ? avatar_url : undefined,
        preferences: preferences !== undefined ? preferences : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('更新用户资料失败:', error);
      return NextResponse.json({ error: '更新用户资料失败' }, { status: 500 });
    }

    return NextResponse.json({ profile, message: '资料更新成功' });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 删除用户资料（注意：这不会删除用户账户，只是删除扩展资料）
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('删除用户资料失败:', error);
      return NextResponse.json({ error: '删除用户资料失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '用户资料已删除' });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}