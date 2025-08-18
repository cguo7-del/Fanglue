import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  relevance: number;
}

interface SearchFilters {
  category: string;
  source: string;
  sortBy: 'relevance' | 'date' | 'title';
}

// 模拟的古籍数据库
const mockDatabase = [
  {
    id: '1',
    title: '论语·学而篇',
    content: '子曰："学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？"',
    source: 'analects',
    sourceName: '论语',
    category: 'philosophy',
    categoryName: '人生哲学',
    keywords: ['学习', '朋友', '君子', '修养', '快乐']
  },
  {
    id: '2',
    title: '道德经·第一章',
    content: '道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。',
    source: 'tao',
    sourceName: '道德经',
    category: 'philosophy',
    categoryName: '人生哲学',
    keywords: ['道', '自然', '哲学', '宇宙', '本源']
  },
  {
    id: '3',
    title: '孙子兵法·计篇',
    content: '兵者，国之大事，死生之地，存亡之道，不可不察也。',
    source: 'sunzi',
    sourceName: '孙子兵法',
    category: 'military',
    categoryName: '军事战略',
    keywords: ['战略', '决策', '重要性', '生死', '国家']
  },
  {
    id: '4',
    title: '论语·为政篇',
    content: '子曰："为政以德，譬如北辰，居其所而众星共之。"',
    source: 'analects',
    sourceName: '论语',
    category: 'politics',
    categoryName: '治国理政',
    keywords: ['政治', '德治', '领导', '道德', '影响力']
  },
  {
    id: '5',
    title: '孟子·梁惠王篇',
    content: '民为贵，社稷次之，君为轻。',
    source: 'mencius',
    sourceName: '孟子',
    category: 'politics',
    categoryName: '治国理政',
    keywords: ['民本', '政治', '优先级', '人民', '统治者']
  },
  {
    id: '6',
    title: '道德经·第八章',
    content: '上善若水，水善利万物而不争，处众人之所恶，故几于道。',
    source: 'tao',
    sourceName: '道德经',
    category: 'cultivation',
    categoryName: '修身养性',
    keywords: ['品德', '谦逊', '利他', '不争', '智慧']
  },
  {
    id: '7',
    title: '论语·里仁篇',
    content: '子曰："君子喻于义，小人喻于利。"',
    source: 'analects',
    sourceName: '论语',
    category: 'cultivation',
    categoryName: '修身养性',
    keywords: ['道德', '义利', '品格', '价值观', '选择']
  },
  {
    id: '8',
    title: '孙子兵法·谋攻篇',
    content: '知己知彼，百战不殆；不知彼而知己，一胜一负；不知彼不知己，每战必殆。',
    source: 'sunzi',
    sourceName: '孙子兵法',
    category: 'business',
    categoryName: '商业智慧',
    keywords: ['了解', '竞争', '信息', '成功', '失败']
  },
  {
    id: '9',
    title: '论语·学而篇',
    content: '子曰："信近于义，言可复也；恭近于礼，远耻辱也；因不失其亲，亦可宗也。"',
    source: 'analects',
    sourceName: '论语',
    category: 'relationships',
    categoryName: '人际关系',
    keywords: ['诚信', '礼貌', '关系', '承诺', '尊重']
  },
  {
    id: '10',
    title: '大学·修身篇',
    content: '古之欲明明德于天下者，先治其国；欲治其国者，先齐其家；欲齐其家者，先修其身。',
    source: 'daxue',
    sourceName: '大学',
    category: 'cultivation',
    categoryName: '修身养性',
    keywords: ['修身', '齐家', '治国', '平天下', '循序渐进']
  },
  {
    id: '11',
    title: '中庸·诚篇',
    content: '诚者，天之道也；诚之者，人之道也。',
    source: 'zhongyong',
    sourceName: '中庸',
    category: 'cultivation',
    categoryName: '修身养性',
    keywords: ['诚信', '天道', '人道', '真诚', '品德']
  },
  {
    id: '12',
    title: '史记·项羽本纪',
    content: '力拔山兮气盖世，时不利兮骓不逝。',
    source: 'shiji',
    sourceName: '史记',
    category: 'philosophy',
    categoryName: '人生哲学',
    keywords: ['英雄', '时运', '命运', '力量', '悲壮']
  }
];

// 计算文本相似度的简单算法
function calculateRelevance(query: string, item: any): number {
  const queryLower = query.toLowerCase();
  let score = 0;
  
  // 标题匹配
  if (item.title.toLowerCase().includes(queryLower)) {
    score += 0.3;
  }
  
  // 内容匹配
  if (item.content.toLowerCase().includes(queryLower)) {
    score += 0.4;
  }
  
  // 关键词匹配
  const matchingKeywords = item.keywords.filter((keyword: string) => 
    keyword.toLowerCase().includes(queryLower) || queryLower.includes(keyword.toLowerCase())
  );
  score += matchingKeywords.length * 0.1;
  
  // 语义匹配（简化版）
  const semanticKeywords = {
    '困难': ['挫折', '艰难', '问题', '障碍'],
    '成功': ['胜利', '成就', '达成', '实现'],
    '领导': ['管理', '治理', '统治', '指导'],
    '学习': ['教育', '知识', '智慧', '修养'],
    '朋友': ['友谊', '关系', '交往', '社交'],
    '商业': ['生意', '经商', '贸易', '经营'],
    '品德': ['道德', '品格', '修养', '德行']
  };
  
  for (const [key, synonyms] of Object.entries(semanticKeywords)) {
    if (queryLower.includes(key) || synonyms.some(syn => queryLower.includes(syn))) {
      const relatedKeywords = item.keywords.filter((keyword: string) => 
        synonyms.includes(keyword) || keyword === key
      );
      score += relatedKeywords.length * 0.05;
    }
  }
  
  return Math.min(score, 1); // 限制最大值为1
}

// 应用筛选器
function applyFilters(items: any[], filters: SearchFilters): any[] {
  let filtered = items;
  
  // 分类筛选
  if (filters.category !== 'all') {
    filtered = filtered.filter(item => item.category === filters.category);
  }
  
  // 来源筛选
  if (filters.source !== 'all') {
    filtered = filtered.filter(item => item.source === filters.source);
  }
  
  // 排序
  switch (filters.sortBy) {
    case 'relevance':
      filtered.sort((a, b) => b.relevance - a.relevance);
      break;
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'date':
      // 模拟按日期排序（实际应用中应该有真实的日期字段）
      filtered.sort((a, b) => a.id.localeCompare(b.id));
      break;
  }
  
  return filtered;
}

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

    const body = await request.json();
    const { query, filters = { category: 'all', source: 'all', sortBy: 'relevance' } } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: '搜索关键词不能为空' },
        { status: 400 }
      );
    }

    if (query.trim().length > 100) {
      return NextResponse.json(
        { error: '搜索关键词长度不能超过100个字符' },
        { status: 400 }
      );
    }

    // 执行搜索
    const searchQuery = query.trim();
    
    // 计算每个项目的相关度
    const itemsWithRelevance = mockDatabase.map(item => ({
      ...item,
      relevance: calculateRelevance(searchQuery, item)
    }));
    
    // 过滤出相关度大于0的结果
    const relevantItems = itemsWithRelevance.filter(item => item.relevance > 0);
    
    // 应用筛选器和排序
    const filteredItems = applyFilters(relevantItems, filters);
    
    // 转换为返回格式
    const results: SearchResult[] = filteredItems.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      source: item.sourceName,
      category: item.categoryName,
      relevance: item.relevance
    }));

    // 限制返回结果数量
    const limitedResults = results.slice(0, 20);

    return NextResponse.json({
      success: true,
      results: limitedResults,
      total: results.length,
      query: searchQuery,
      filters
    });

  } catch (error) {
    console.error('Smart Search API Error:', error);
    return NextResponse.json(
      { error: '搜索服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
}

// 获取搜索建议和统计信息
export async function GET() {
  const suggestions = [
    '如何面对困难',
    '领导力智慧', 
    '人际关系处理',
    '商业经营之道',
    '修身养性方法',
    '学习的重要性',
    '诚信的价值',
    '战略思维'
  ];
  
  const categories = [
    { id: 'all', name: '全部分类', count: mockDatabase.length },
    { id: 'philosophy', name: '人生哲学', count: mockDatabase.filter(item => item.category === 'philosophy').length },
    { id: 'politics', name: '治国理政', count: mockDatabase.filter(item => item.category === 'politics').length },
    { id: 'military', name: '军事战略', count: mockDatabase.filter(item => item.category === 'military').length },
    { id: 'business', name: '商业智慧', count: mockDatabase.filter(item => item.category === 'business').length },
    { id: 'cultivation', name: '修身养性', count: mockDatabase.filter(item => item.category === 'cultivation').length },
    { id: 'relationships', name: '人际关系', count: mockDatabase.filter(item => item.category === 'relationships').length }
  ];
  
  const sources = [
    { id: 'all', name: '全部典籍', count: mockDatabase.length },
    { id: 'analects', name: '论语', count: mockDatabase.filter(item => item.source === 'analects').length },
    { id: 'tao', name: '道德经', count: mockDatabase.filter(item => item.source === 'tao').length },
    { id: 'sunzi', name: '孙子兵法', count: mockDatabase.filter(item => item.source === 'sunzi').length },
    { id: 'daxue', name: '大学', count: mockDatabase.filter(item => item.source === 'daxue').length },
    { id: 'zhongyong', name: '中庸', count: mockDatabase.filter(item => item.source === 'zhongyong').length },
    { id: 'mencius', name: '孟子', count: mockDatabase.filter(item => item.source === 'mencius').length },
    { id: 'shiji', name: '史记', count: mockDatabase.filter(item => item.source === 'shiji').length }
  ];

  return NextResponse.json({
    suggestions,
    categories,
    sources,
    totalItems: mockDatabase.length
  });
}