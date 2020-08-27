---
title: echo回声程序的实现
date: 2020-08-25 08:24:29
tags:
- c
categories:
- network
---

### 服务器
```c
#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#define BUFF_SIZE 10

void error_handling(char *message) {
  fputs(message, stderr);
  fputc('\n', stderr);
  exit(1);
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    printf("Usage: %s <port>\n", argv[0]);
    exit(1);
  }

  // 服务端的调用顺序
  // socket
  // 初始化sockaddr_in对象
  // bind
  // listen
  // accept
  // read write
  int server_sock = socket(PF_INET, SOCK_STREAM, 0);

  if (server_sock == -1)
    error_handling("socket() error");

  struct sockaddr_in server_addr;
  memset(&server_addr, 0, sizeof(server_addr));
  server_addr.sin_family = AF_INET;
  server_addr.sin_addr.s_addr = INADDR_ANY;
  server_addr.sin_port = htons(atoi(argv[1]));

  if (bind(server_sock, (struct sockaddr *)&server_addr, sizeof(server_addr)) ==
      -1)
    error_handling("bind() error");

  if (listen(server_sock, 5) == -1)
    error_handling("listen() error");

  char buff[BUFF_SIZE];

  while (1) {
    struct sockaddr_in client_addr;
    socklen_t client_addr_size = sizeof(client_addr);
    int client_sock =
        accept(server_sock, (struct sockaddr *)&client_addr, &client_addr_size);

    printf("new client connected\n");
    printf("ip:%s,port:%d\n", inet_ntoa(client_addr.sin_addr),
           ntohs(client_addr.sin_port));

    if (client_sock == -1)
      error_handling("accept() error");
    int read_len;

    // 如果read函数返回0 说明客户端关闭了连接
    while ((read_len = read(client_sock, buff, BUFF_SIZE)) != 0)
      write(client_sock, buff, read_len);

    // 退出while,说明read返回0,说明客户端关闭了连接,服务器也关闭连接
    close(client_sock);
  }

  close(server_sock);
  return 0;
}
```
### 客户端
```c
#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#define BUFF_SIZE 10

void error_handling(char *message) {
  fputs(message, stderr);
  fputc('\n', stderr);
  exit(1);
}

int main(int argc, char *argv[]) {
  if (argc != 3) {
    printf("Usage: %s <server IP> <port>\n", argv[0]);
    exit(1);
  }

  // 客户端的调用顺序
  // socket
  // 初始化要连接服务器的sockaddr_in对象
  // connect
  // read write
  int sock = socket(PF_INET, SOCK_STREAM, 0);

  struct sockaddr_in server_addr;
  server_addr.sin_family = AF_INET;
  inet_aton(argv[1], &server_addr.sin_addr);
  // server_addr.sin_addr.s_addr = inet_addr(argv[1]);
  server_addr.sin_port = htons(atoi(argv[2]));

  if (connect(sock, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1)
    error_handling("connect() error");

  char buff[BUFF_SIZE];
  while (1) {
    fgets(buff, BUFF_SIZE, stdin);
    if (strcmp(buff, "q\n") == 0 || strcmp(buff, "Q\n") == 0)
      break;
    int write_len = write(sock, buff, strlen(buff));
    // 如果用户输入超出缓冲,循环读取完成
    while (buff[strlen(buff) - 1] != '\n') {
      fgets(buff, BUFF_SIZE, stdin);
      write_len += write(sock, buff, strlen(buff));
    }
    int read_len = 0;
    printf("message from server: ");
    while (read_len < write_len) {
      int read_count = read(sock, buff, BUFF_SIZE - 1);
      if (read_count == -1)
        error_handling("read() error");
      read_len += read_count;
      buff[read_count] = 0;
      printf("%s", buff);
    }
  }
  close(sock);

  return 0;
}
```
