# oduck-server

# How To Use?

1. [환경 변수](./docs/env.md)
2. [Prisma](./docs/prisma.md)
3. [NestJS](./docs/nestjs.md)
4. [Docker](./docs/docker.md)

## 커밋 메세지 컨벤션

### 커밋 형식

커밋 메세지 형식은 다음을 따릅니다:

```bash
type: subject #issue-number

body

footer
```

- `type` : 커밋의 종류를 나타냅니다. 종류는 다음 항목을 참고해주세요.
- `subject` : 커밋의 요약을 나타냅니다.
- `iuuse-number` : 관련된 이슈 번호를 나타냅니다.
- `body` : 커밋의 자세한 내용을 나타냅니다. (선택)
- `footer` : 커밋과 관련된 이슈를 닫거나, 어떤 변경을 가져오는지 등 추가적인 정보를 나타냅니다. (선택)

예시는 다음과 같습니다:

> Header 컴포넌트를 개발, 이에 따른 스타일을 변경함

```bash
feat: Header 컴포넌트 구현 및 스타일 수정 #123

* 헤더 컴포넌트를 개발합니다. 새 컴포넌트에 맞게 style.css를 수정했습니다.

* Close #123
```

### 커밋 종류 (type)

- `feat` : 새로운 기능
- `fix` : 버그 수정
- `docs` : 문서만 변경
- `style` : 코드에 영향을 주지 않는 변경 (공백, 세미콜론, css 등)
- `refactor` : 코드 리팩토링. 코드의 기능 변경이 아닌 가독성을 높이거나 재사용성 향상, 주석 추가 등
- `test` : 테스트 추가, 기존 테스트 수정 등
- `cleanup` : 불필요 파일 삭제, 코드 삭제
- `chore` : 프로젝트 운영(유지보수, 개선) 업데이트. 빌드 설정, 의존성 변경, 스크립트 추가 등
