#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/wait.h>
#include <string.h>

#define MAXLINE 1024
#define MAXARGS 128 //定义最大参数
extern char **environ;
//cmdline:命令行
void eval(char *cmdline);
//解析命令行,构建参数参数列表
int parseline(char *buf, char **argv);

int builtin_command(char **argv);

int main()
{
  char cmdline[MAXLINE]; //命令行
  while (1) {
    printf("> ");
    if (NULL == fgets(cmdline, MAXLINE, stdin)) {
      exit(0); // hasn't read data from stdin, exit
    }
    eval(cmdline);
  }
}

void eval(char *cmdline)
{
  char *argv[MAXARGS]; //存储环境变量
  char buf[MAXLINE]; //临时缓存命令行字符,这些数据被用来构建argv
  int bg; //是否是后台运行
  pid_t pid;

  strcpy(buf, cmdline);
  bg = parseline(buf, argv);
  if (argv[0] == NULL) {
    return; //如果是空行,则忽略
  }
  if (!builtin_command(argv)) {
    if ((pid=fork()) == 0) { //child proccess
      if (execve(argv[0], argv, environ) < 0) {
        printf("%s, Command not found. \n", argv[0]);
        exit(0);
      } else {
        if (bg != 1) {
          int status;
          if (waitpid(pid, &status, 0) < 0) {
            printf("waitfg: waitpid error");
          }
        } else {
          printf("%d, %s", pid, cmdline);
        }
      }
    }
  }
}

int builtin_command(char **argv)
{
  if (!strcmp(argv[0], "quit")) {
    exit(0);
  }
  if (!strcmp(argv[0], "&")) {
    return 1;
  }
  return 0;
}

int parseline(char *buf, char **argv)
{
  //first:清理buf左边的空格
  while (*buf && (*buf==' ')) {
    buf++;
  }
  //second:开始构建argv,以空格为分隔符
  char *delimiter;
  int argc = 0;
  while ((delimiter=strchr(buf, ' '))) {
    argv[argc++] = buf;
    *delimiter = '\0'; //截断buf
    buf = delimiter+1; //从新开始
    while (*buf && (*buf== ' ')) {
      buf++;
    }
  }
  argv[argc] = NULL;
  //third: check
  if (argc == 0) {
    return 1;
  }
  int bg = 0;
  if ((bg=(*argv[argc-1])=='&') != 0) {
    argv[argc-1] = NULL;
  }
  return bg;
}
