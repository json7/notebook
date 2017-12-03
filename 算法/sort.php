<?php
//--------------
#从排序速度由快到慢为:快速排序, 选择排序, 冒泡排序
#1万长度的无序数组运行结果如下
#泡排序:
#1512314183.8647
#1512314187.5015
#快速排序:
#1512314187.5015
#1512314187.5118
#选择排序:
#1512314187.5118
#1512314189.2667
#冒泡排序需要将近4s,快速排序毫秒级别,选择排序将近2s
#选择排序在外层循环进行数值交换,冒泡排序在内层循环进行交换.很明显选择排序的交换次数更少.这是选择排序比冒泡排序快的根本原因.
//--------------


$data = range(1, 10000);
shuffle($data);

//冒泡排序 升序
function bubble($data)
{
  $length = count($data);
  $tmp = 0;
  for ($j=0; $j<$length; $j++) {
    $flag = 0;
    for ($i=0; $i<$length-1-$j; $i++) { //此处为什么要减去$j,因为此时$data[$length-1-$j]内的数字都已经是最大的数字,不需要再比较
      //如果下一个值小于当前值
      if ($data[$i] > $data[$i+1]) {
        $tmp = $data[$i+1];
        $data[$i+1] = $data[$i];
        $data[$i] = $tmp;
        $flag = 1;
      }
    }
    if ($flag == 0) {
      break;
    }
  }
  return $data;
}
echo "冒泡排序:\r\n";
echo microtime(true) . "\r\n";
bubble($data);
echo microtime(true) . "\r\n";


//快速排序
function quick($data)
{
  $right = $left = [];
  $length = count($data);
  if ($length <= 1) {
    return $data;
  }
  $baseNum = $data[0];

  for ($i=1; $i<$length; $i++) {
    if ($data[$i] > $baseNum) {
      $right[] = $data[$i];
    }else {
      $left[] = $data[$i];
    }
  }
  $left = quick($left);
  $right = quick($right);
  return array_merge($left, $right);
}
echo "快速排序:\r\n";
echo microtime(true) . "\r\n";
quick($data);
echo microtime(true) . "\r\n";

//选择排序
function choose($data)
{
  $length = count($data);
  for ($i=0; $i<$length; $i++) {
    $minIndex = $i;
    for ($j=$i+1; $j<$length; $j++) {
      if ($data[$i] > $data[$j]) {
        $minIndex = $j;
      }
    }
    $tmp = $data[$minIndex];
    $data[$minIndex] = $data[$i];
    $data[$i] = $tmp;
  }
  return $data;
}

echo "选择排序:\r\n";
echo microtime(true) . "\r\n";
choose($data);
echo microtime(true) . "\r\n";


?>
