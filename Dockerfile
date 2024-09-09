FROM --platform=$BUILDPLATFORM node:20.11.1-bullseye-slim as builder

RUN mkdir /project
WORKDIR /project

RUN npm install -g @angular/cli@18

COPY "rag-2-frontend/package.json" "rag-2-frontend/package-lock.json" ./
RUN npm ci

COPY . .
CMD ["ng", "serve", "--host", "0.0.0.0"]

FROM builder as dev-envs

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF

COPY "rag-2-frontend/" .

CMD ["ng", "serve", "--host", "0.0.0.0"]
