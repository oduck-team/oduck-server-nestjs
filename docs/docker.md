# Docker 실행 방법

1. docker 설치 후 실행
2. server 폴더에서 다음 명령어들 실행

> ```bash
> # 도커 이미지 빌드
> docker build . -t oduck-nest
>
> # 도커 컨테이너 실행
> docker container run --name oduck-docker -d -p 8000:8000 oduck-nest
>
> # 도커 컨테이너 로그 확인
> docker container logs oduck-docker
>
> # 도커 컨테이너 재실행
> docker container restart oduck-docker
>
> # 도커 컨테이너 중단
> docker container stop oduck-docker
> ```
