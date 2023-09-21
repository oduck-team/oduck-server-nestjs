const adjectives: string[] = [
  '벽력일섬쓰는',
  '영역전개하느',
  '에네르기파쓰는',
  '이세계로간',
  '트럭에치인',
  '포켓몬잡는',
  '건담을타는',
  '마법소녀',
  '열매능력자',
  '해적왕',
  '칠무해',
  '해군',
  '나뭇잎마을닌자',
  '아카츠키',
  '닌자연합군',
  '호정13대',
  '사신대행',
  '아란칼',
  '영령',
  '마스터',
  '서번트',
  '최강슬라임',
  '헌터',
];
const nouns: string[] = ['오리', '오덕', '덕후'];
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateNickname = () => {
  const selectedAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const selectedNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${selectedAdjective}_${selectedNoun}_${generateRandomTag()}`;
};

const generateRandomTag = () => {
  let tag = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    tag += characters.charAt(randomIndex);
  }

  return tag;
};
