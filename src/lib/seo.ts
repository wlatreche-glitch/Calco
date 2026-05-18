type SeoConfig = {
  title: string;
  description: string;
  type?: string;
  image?: string;
  robots?: string;
  twitterSite?: string;
  imageAlt?: string;
  locale?: string;
};

const DEFAULT_TITLE = 'Calco — الحاسبة التعليمية الذكية للطلاب الجزائريين';
const DEFAULT_DESCRIPTION =
  'Calco منصة تعليمية ذكية لمراجعة البكالوريا وBEM: الرياضيات، الفيزياء، الكيمياء، الإحصاء، والكويزات التفاعلية.';
const DEFAULT_IMAGE = '/placeholder.svg';
const DEFAULT_TWITTER_SITE = '@calco';
const DEFAULT_LOCALE = 'ar_DZ';

const ROUTE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'Calco — مراجعة الباك الذكية وحاسبة المعدل',
    description:
      'ابدأ مراجعة البكالوريا مع أدوات الرياضيات، الفيزياء، الكيمياء، والإحصاء المصممة للمنهج الجزائري.',
  },
  '/equations': {
    title: 'المعادلات — Calco',
    description: 'حل المعادلات والمتراجحات خطوة بخطوة مع دعم المنهج الجزائري.',
  },
  '/functions': {
    title: 'الدوال — Calco',
    description: 'حل وتفسير الدوال والاشتقاق والتكامل عبر أدوات تفاعلية سهلة.',
  },
  '/graph': {
    title: 'الرسم البياني — Calco',
    description: 'تحليل الدوال وعرضها بيانياً مع أدوات رسومية تفاعلية.',
  },
  '/physics': {
    title: 'الفيزياء — Calco',
    description: 'حاسبة فيزياء تفاعلية لميكانيكا، كهرومغناطيسية، الطاقة، والأمواج.',
  },
  '/bac-math': {
    title: 'رياضيات الباك — Calco',
    description: 'ستة أدوات متخصصة لمراجعة الرياضيات في البكالوريا الجزائرية.',
  },
  '/bem': {
    title: 'Calco BEM — منصة مراجعة رياضيات وعلوم المتوسط',
    description: 'أدوات موجهة للطلاب في شهادة التعليم المتوسط BEM.',
  },
  '/bem-math': {
    title: 'رياضيات BEM — Calco',
    description: 'مراجعة رياضيات المتوسط مع حلول وأمثلة منهجية.',
  },
  '/bem-physics': {
    title: 'فيزياء BEM — Calco',
    description: 'أدوات فيزياء المتوسط لمراجعة قوانين الحركة، الدارات، والطاقة.',
  },
  '/bac-chemistry': {
    title: 'الكيمياء — Calco',
    description: 'مسارات كيمياء تفاعلية للباكالوريا مع معادلات وأمثلة تطبيقية.',
  },
  '/coach': {
    title: 'Calco Coach — مراجعة شخصية للباك',
    description: 'تدريبات ذكية، تتبع الأداء، وتوصيات مراجعة مصممة لطلاب البكالوريا.',
  },
  '/exercises': {
    title: 'التمارين — Calco',
    description: 'تمارين تفاعلية ومراجعات سريعة لتحسين مستواك في الرياضيات والعلوم.',
  },
  '/matrices': {
    title: 'المصفوفات — Calco',
    description: 'حل العمليات على المصفوفات وحل أنظمة المعادلات بطريقة منظمة.',
  },
  '/sequences': {
    title: 'المتتاليات — Calco',
    description: 'مراجعة المتتاليات الحسابية والهندسية بطريقة تفاعلية.',
  },
  '/statistics': {
    title: 'الإحصاء — Calco',
    description: 'أدوات إحصاء واحتمالات لتقوية مهاراتك في حل مسائل الباك.',
  },
  '/terms': {
    title: 'شروط الاستخدام — Calco',
    description: 'اقرأ شروط الاستخدام الخاصة بمنصة Calco وكيفية الاستفادة من الأدوات.',
  },
  '/privacy': {
    title: 'سياسة الخصوصية — Calco',
    description: 'تعرف على كيفية تعامل Calco مع بياناتك وخصوصيتك على المنصة.',
  },
};

function normalizePath(pathname: string) {
  const cleaned = pathname.split('?')[0].replace(/\/+$/, '');
  return cleaned.length > 0 ? cleaned : '/';
}

function getMetaConfig(pathname: string): SeoConfig {
  const normalized = normalizePath(pathname);
  return ROUTE_SEO[normalized] ?? {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    type: 'website',
    robots: 'index, follow',
    twitterSite: DEFAULT_TWITTER_SITE,
    imageAlt: 'صورة معاينة Calco',
    locale: DEFAULT_LOCALE,
  };
}

function setMeta(
  key: string,
  value: string,
  useProperty = false,
  head: HTMLHeadElement,
) {
  const attribute = useProperty ? 'property' : 'name';
  const selector = `meta[${attribute}='${key}']`;
  let element = head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    head.appendChild(element);
  }

  element.setAttribute('content', value);
}

function setLink(rel: string, href: string, head: HTMLHeadElement) {
  let element = head.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function updateJsonLd(metadata: SeoConfig, pageUrl: string, origin: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl,
    name: metadata.title,
    description: metadata.description,
    inLanguage: metadata.locale ?? 'ar',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Calco',
      url: origin,
    },
  };

  const head = document.head;
  let script = head.querySelector('#calco-schema-jsonld') as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.id = 'calco-schema-jsonld';
    head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
}

export function applySeo(pathname: string, overrides?: Partial<SeoConfig>) {
  if (typeof document === 'undefined') {
    return;
  }

  const head = document.head;
  const metadata = {
    ...getMetaConfig(pathname),
    ...overrides,
  };

  const origin = window.location.origin;
  const pathnameSegment = normalizePath(pathname);
  const pageUrl = `${origin}${pathnameSegment}`;
  const image = metadata.image ?? DEFAULT_IMAGE;
  const robots = metadata.robots ?? 'index, follow';

  document.title = metadata.title;
  setMeta('description', metadata.description, false, head);
  setMeta('robots', robots, false, head);
  setMeta('og:locale', metadata.locale ?? DEFAULT_LOCALE, true, head);
  setMeta('og:title', metadata.title, true, head);
  setMeta('og:description', metadata.description, true, head);
  setMeta('og:type', metadata.type ?? 'website', true, head);
  setMeta('og:url', pageUrl, true, head);
  setMeta('og:image', image, true, head);
  setMeta('og:site_name', 'Calco', true, head);
  setMeta('og:image:alt', metadata.imageAlt ?? 'صورة معاينة Calco', true, head);
  setMeta('twitter:card', 'summary_large_image', false, head);
  setMeta('twitter:title', metadata.title, false, head);
  setMeta('twitter:description', metadata.description, false, head);
  setMeta('twitter:image', image, false, head);
  setMeta('twitter:site', metadata.twitterSite ?? DEFAULT_TWITTER_SITE, false, head);
  setLink('canonical', pageUrl, head);
  updateJsonLd(metadata, pageUrl, origin);
}
