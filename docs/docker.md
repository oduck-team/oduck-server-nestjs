```bash
# 도커 이미지 빌드
docker build . -t oduck-nest

# 도커 컨테이너 실행
docker container run --name oduck-docker -d -p 8000:8000 oduck-nest

# 도커 컨테이너 중단
docker container stop oduck-docker
```
