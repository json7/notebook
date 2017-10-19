#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <fcntl.h>
#include <sys/types.h>
#include <errno.h>
#include <signal.h>

#define MAXLINE 1024

void recovery(int sig)
{
  pid_t pid;
  while ((pid=waitpid(-1, NULL, 0)) > 0) {
    printf("master has been received the info of child:%d exit. \n", pid);
  }
  sleep(2);
  return;
}

int main()
{
  int i,n;
  char buf[MAXLINE];
  pid_t pid;

  if (signal(SIGCHLD, recovery) == SIG_ERR) {
    perror("signal error");
  }
  //创建三个child process
  for (i=0; i<3; i++) {
    pid = fork();
    if (pid == 0) {
      printf("hello world, %d is coming. \n", (int)getpid());
      sleep(1);
      exit(0);
    }
  }
  //在一些老版本的系统上,系统调用如果被信号中断,那么系统调用很可能会提前返回,并且返回一个EINTR的错误
  while ((n=read(STDIN_FILENO, buf, sizeof(buf))) < 0) {
    //如果是信号造成的终端,则忽略错误继续read
    if (errno != EINTR) {
      perror("read");
    }
  }
  printf("parent proccess input:%s \n", buf);
  while (1);
  return 0;
}
