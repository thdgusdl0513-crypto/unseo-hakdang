/* 송현학당 · 학급 설정
   학생 입장 암호를 바꾸려면 아래 pw 를 바꾸고, Firebase 규칙(database.rules.json)의 같은 글자도 똑같이 바꿔 주세요.
   선생님 코드는 이 파일에 없어요(학생들이 볼 수 없게). 규칙 파일에만 있어요. */
window.CLASS = {
  name: '송현학당',
  pw: 'songhyeon17',       // 학생 입장 암호
  base: 'songhyeon/'       // Firebase 안의 저장 칸 (운서학당과 섞이지 않게) — 바꾸지 마세요
};
