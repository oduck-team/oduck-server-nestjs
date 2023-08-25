# Docker 실행 방법

1. docker 설치 후 실행
2. server 폴더에서 다음 명령어 실행

> ```bash
> # docker-compose 실행(redis + nestjs)
> docker-compose up -d --build
>
> # docker 컨테이너 확인
> docker ps
>
> # docker 컨테이너 로그 확인
> docker container logs oDuckio-nestjs
>
> # docker 컨테이너 터미널
> docker exec -it <container id> /bin/bash
>
> # docker-compose 종료 및 컨테이너 삭제
> docker-compose down
> ```
