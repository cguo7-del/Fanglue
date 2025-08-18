import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 模拟AI回答的函数
function generateAIResponse(question: string, selectedBooks: string[], category: string): string {
  // 这里应该调用真实的AI API，比如OpenAI GPT
  // 现在使用模拟回答
  
  const bookTitles = {
    '1': '论语',
    '2': '道德经', 
    '3': '孙子兵法',
    '4': '大学',
    '5': '中庸',
    '6': '孟子',
    '7': '史记',
    '8': '资治通鉴'
  };

  const selectedBookNames = selectedBooks.map(id => bookTitles[id as keyof typeof bookTitles]).filter(Boolean);
  
  // 根据问题类型和选择的书籍生成不同的回答
  if (question.includes('困难') || question.includes('挫折') || question.includes('平静')) {
    return `关于您提出的问题"${question}"，古代先贤们有着深刻的见解：

**道家智慧：**
老子在《道德经》中说："上善若水，水善利万物而不争。"面对困难时，我们应该像水一样，保持柔韧和包容的心态。困难如山石，水能绕过、能穿透，最终必能到达目的地。

**儒家观点：**
孔子曾说："君子坦荡荡，小人长戚戚。"内心的平静来自于品德的修养和对道德的坚持。当我们行得正、坐得端时，自然能够在困难面前保持内心的宁静。

**实践建议：**
1. **接受现实**：承认困难的存在，不逃避不抱怨
2. **保持初心**：记住自己的目标和价值观
3. **寻求智慧**：从古籍中汲取前人的经验
4. **修身养性**：通过学习和反思提升自己

正如《中庸》所言："天命之谓性，率性之谓道，修道之谓教。"通过不断的修养和学习，我们能够在任何困难面前都保持内心的平静与坚定。`;
  }
  
  if (question.includes('领导') || question.includes('管理') || question.includes('治理')) {
    return `关于"${question}"这个问题，古代治国理政的智慧为我们提供了宝贵的指导：

**孔子的仁政思想：**
"为政以德，譬如北辰，居其所而众星共之。"真正的领导者应该以德服人，用自己的品德和智慧来感化和引导他人。

**孟子的民本思想：**
"民为贵，社稷次之，君为轻。"好的领导者要时刻记住人民的利益是最重要的，要为人民服务，而不是让人民为自己服务。

**老子的无为而治：**
"太上，不知有之；其次，亲而誉之；其次，畏之；其次，侮之。"最高明的领导是让下属感觉不到管理的存在，通过营造良好的环境和制度让大家自觉地做好工作。

**实践要点：**
1. **以身作则**：领导者的行为是最好的教育
2. **知人善任**：了解每个人的特长并合理安排
3. **倾听民意**：经常了解下属和民众的想法
4. **公正无私**：处事公平，不偏不倚
5. **持续学习**：不断提升自己的能力和见识

《资治通鉴》中说："用人如器，各取所长。"好的领导者要善于发现和使用每个人的优点。`;
  }
  
  if (question.includes('商业') || question.includes('生意') || question.includes('经商') || question.includes('竞争')) {
    return `对于"${question}"，古代商业智慧和战略思想给我们很多启发：

**孙子兵法的战略思维：**
"知己知彼，百战不殆。"在商业竞争中，深入了解自己的优势劣势和竞争对手的情况是成功的关键。

"兵者，诡道也。"商业竞争需要灵活的策略，有时需要出其不意的创新思路。

**老子的柔性智慧：**
"天下莫柔弱于水，而攻坚强者莫之能胜。"在激烈的市场竞争中，有时柔性的策略比强硬的手段更有效。

**儒家的诚信理念：**
"人而无信，不知其可也。"诚信是商业的根本，短期的欺骗可能带来利益，但长期来看必然失败。

**商业策略建议：**
1. **市场调研**：深入了解市场需求和竞争环境
2. **差异化定位**：找到自己独特的价值主张
3. **诚信经营**：建立良好的商业信誉
4. **灵活应变**：根据市场变化及时调整策略
5. **长远规划**：不只看眼前利益，要有长远视野

正如《易经》所说："穷则变，变则通，通则久。"商业成功需要在变化中寻找机会。`;
  }
  
  if (question.includes('人际关系') || question.includes('交友') || question.includes('沟通') || question.includes('冲突')) {
    return `关于"${question}"，古代先贤在人际交往方面留下了丰富的智慧：

**孔子的交友之道：**
"益者三友，损者三友。友直，友谅，友多闻，益矣。友便辟，友善柔，友便佞，损矣。"选择正直、诚信、博学的朋友，远离那些阿谀奉承、虚伪狡诈的人。

**处理冲突的智慧：**
"和而不同"是孔子提出的重要理念。在人际关系中，我们要保持和谐，但不必强求完全一致。尊重差异，求同存异。

**老子的处世哲学：**
"夫唯不争，故天下莫能与之争。"有时候不争反而能获得更多。在人际关系中，适当的退让和包容往往能化解矛盾。

**沟通的艺术：**
《论语》中说："巧言令色，鲜矣仁。"真诚的沟通比花言巧语更重要。

**实践指导：**
1. **真诚待人**：以诚相待，建立信任基础
2. **换位思考**：理解对方的立场和感受
3. **适度包容**：对他人的缺点要有一定的容忍度
4. **及时沟通**：有问题及时交流，不要积累矛盾
5. **保持边界**：既要友善，也要有自己的原则

《大学》中讲："修身、齐家、治国、平天下。"良好的人际关系从修养自己开始。`;
  }
  
  // 默认回答
  return `感谢您提出"${question}"这个深刻的问题。

古代典籍中蕴含着丰富的智慧，可以为我们现代人的生活提供指导。${selectedBookNames.length > 0 ? `根据您选择的典籍${selectedBookNames.join('、')}，` : ''}让我为您分享一些相关的古代智慧：

**核心观点：**
古人认为，面对人生的各种问题，最重要的是保持正确的心态和价值观。正如《论语》所说："君子求诸己，小人求诸人。"遇到问题时，首先要从自身寻找原因和解决方案。

**实践建议：**
1. **深入思考**：不要急于求成，要深入思考问题的本质
2. **学习古训**：从古代典籍中寻找相似的情况和解决方案
3. **修身养性**：通过不断学习和反思来提升自己
4. **知行合一**：将学到的道理付诸实践

**古人名言：**
"学而时习之，不亦说乎？"学习古代智慧，并在生活中实践，这本身就是一种快乐。

希望这些古代智慧能够为您提供一些启发和帮助。如果您还有其他问题，欢迎继续探讨。`;
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
    const { question, selected_books = [], category = '' } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: '问题不能为空' },
        { status: 400 }
      );
    }

    if (question.trim().length > 1000) {
      return NextResponse.json(
        { error: '问题长度不能超过1000个字符' },
        { status: 400 }
      );
    }

    // 验证选择的书籍ID
    const validBookIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const selectedBooks = Array.isArray(selected_books) 
      ? selected_books.filter(id => validBookIds.includes(String(id)))
      : [];

    // 生成AI回答
    const answer = generateAIResponse(question.trim(), selectedBooks, category);

    // 这里可以添加日志记录，记录用户的提问
    // 可以存储到数据库中用于分析和改进

    return NextResponse.json({
      success: true,
      answer,
      question: question.trim(),
      selected_books: selectedBooks,
      category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ask AI API Error:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 可选：添加GET方法来获取可用的书籍列表
export async function GET() {
  const books = [
    { id: '1', title: '论语', author: '孔子', category: '人生哲学', description: '儒家经典，讲述做人做事的道理' },
    { id: '2', title: '道德经', author: '老子', category: '人生哲学', description: '道家经典，阐述自然之道' },
    { id: '3', title: '孙子兵法', author: '孙武', category: '军事战略', description: '兵家经典，战略智慧的集大成者' },
    { id: '4', title: '大学', author: '曾子', category: '修身养性', description: '四书之一，讲述修身治国之道' },
    { id: '5', title: '中庸', author: '子思', category: '修身养性', description: '儒家经典，阐述中庸之道' },
    { id: '6', title: '孟子', author: '孟子', category: '治国理政', description: '儒家经典，论述仁政思想' },
    { id: '7', title: '史记', author: '司马迁', category: '治国理政', description: '史学经典，记录历史兴衰' },
    { id: '8', title: '资治通鉴', author: '司马光', category: '治国理政', description: '编年体史书，治国理政的智慧宝库' }
  ];

  const categories = [
    '全部', '人生哲学', '治国理政', '军事战略', '商业智慧', 
    '修身养性', '人际关系', '学习方法', '其他'
  ];

  return NextResponse.json({
    books,
    categories
  });
}