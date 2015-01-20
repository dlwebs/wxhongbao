<?php
//公共配置
$common_config = include APP_PATH.'Common/Conf/config.php';

//私有配置
$private_config = array(
                        'SHOW_PAGE_TRACE' => false,
                        'LAYOUT_ON' => false,
                        'URL_ROUTER_ON' => true,
                        'URL_CASE_INSENSITIVE' =>true,
                        'URL_ROUTE_RULES' => array(
                                                  'wx/event' => 'Index/event',
                                                  'wx/getjxhd' => 'Index/getjxhd',
                                                  'detail/:foodid' => 'Index/detail',
                                                  'jxdetail/:jxid' => 'Index/jxdetail',
                                                  'jxzan/:jxid' => 'Index/jxzan',
                                                  'fav/:foodid' => 'Index/favfood',
                                                  'weixin/:uid/:ac' => 'Index/send',
                                                  'baoming/:voteid' => 'Vote/baoming',
                                                  'showvote/:voteid/:sortby' => 'Vote/showvote',
                                                  'addpiao/:bmid' => 'Vote/addpiao',
                                                  )
                        );

return array_merge($common_config, $private_config);
