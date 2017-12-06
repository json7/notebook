变量定义

1. 定义变量时候等于号两边不能有空格,否则变量会被当成命令被调用,导致报错.
error: username = json
success: username=json

2.首个字符必须为字母（a-z，A-Z）,中间不能有空格，可以使用下划线（_）

3.不能使用标点符号

4.不能使用bash里的关键字（可用help命令查看保留关键字）

5.除了显式地直接赋值，还可以用语句给变量赋值，如:for file in `ls /etc`


变量使用

1.使用一个定义过的变量，只要在变量名前面加美元符号即可，如:
username=json
echo $username

2.变量名外面的花括号是可选的，加不加都行，但如果变量和字符串相邻,则必须加.加花括号是为了帮助解释器识别变量的边界，比如下面这种情况：
for skill in Ada Coffe Action Java; do
    echo "I am good at ${skill}Script"
done

3.使用 readonly 命令可以将变量定义为只读变量，只读变量的值不能被改变。
username=json
readonly username
username=json7 //test.sh: line 6: username: readonly variable


删除变量

1.使用 unset 命令可以删除变量。语法:
unset username

2.变量被删除后不能再次使用,unset 命令不能删除只读变量.
username=json
unset username
echo $username //没有任何输出

变量类型

1.局部变量
局部变量在脚本或命令中定义，仅在当前shell实例中有效，其他shell启动的程序不能访问局部变量

2.环境变量
所有的程序，包括shell启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候shell脚本也可以定义环境变量

3.shell变量
shell变量是由shell程序设置的特殊变量。shell变量中有一部分是环境变量，有一部分是局部变量，这些变量保证了shell的正常运行


shell字符串

1.字符串是shell编程中最常用最有用的数据类型（除了数字和字符串，也没啥其它类型好用了），字符串可以用单引号，也可以用双引号，也可以不用引号。单双引号的区别跟PHP类似,单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的;
username='json'
username="json"

2.单引号字串中不能出现单引号（对单引号使用转义符后【也】不行）

3.双引号的优点:
双引号里可以有变量
双引号里可以出现转义字符

4.字符串拼接
username="json"
username="json "json"!"
username="json $username"
echo $username

5.获取字符串长度
username=json
echo ${#username}

6.提取子字符串
username=json7
echo ${username:1:3}

7.查找子字符串
username=json7
echo `expr index $username o`

8.字符串替换
username=json7
${username/s/y} #替换第一次d额s
${username//s/y} #替换所有s
${str/#j/o}  # 如果字符串str以apple开头，则用APPLE替换它

9.截取子串
str="abbc,def,ghi,abcjkl"
echo ${str#a*c}     # 输出,def,ghi,abcjkl  一个井号(#) 表示从左边截取掉最短的匹配 (这里把abbc字串去掉）
echo ${str##a*c}    # 输出jkl，             两个井号(##) 表示从左边截取掉最长的匹配 (这里把abbc,def,ghi,abc字串去掉)
echo ${str#"a*c"}   # 输出abbc,def,ghi,abcjkl 因为str中没有"a*c"子串
echo ${str##"a*c"}  # 输出abbc,def,ghi,abcjkl 同理
echo ${str#*a*c*}   # 空
echo ${str##*a*c*}  # 空
echo ${str#d*f)     # 输出abbc,def,ghi,abcjkl,
echo ${str#*d*f}    # 输出,ghi,abcjkl

echo ${str%a*l}     # abbc,def,ghi  一个百分号(%)表示从右边截取最短的匹配
echo ${str%%b*l}    # a             两个百分号表示(%%)表示从右边截取最长的匹配
echo ${str%a*c}     # abbc,def,ghi,abcjkl

10.比较
[[ "a.txt" == a* ]]        # 逻辑真 (pattern matching)
[[ "a.txt" =~ .*\.txt ]]   # 逻辑真 (regex matching)
[[ "abc" == "abc" ]]       # 逻辑真 (string comparision)
[[ "11" < "2" ]]           # 逻辑真 (string comparision), 按ascii值比较


数组

1.bash支持一维数组（不支持多维数组），并且没有限定数组的大小。
类似与C语言，数组元素的下标由0开始编号。获取数组中的元素要利用下标，下标可以是整数或算术表达式，其值应大于或等于0。
e.g:数组名=(值1 值2 ... 值n)

2.数组遍历
for user in ${username[@]}; do
echo $user
done

3.获取数组所有元素
${username[@]}

4.获取数组长度
${#username[@]}
