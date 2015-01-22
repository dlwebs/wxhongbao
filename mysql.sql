
DROP TABLE IF EXISTS `wxmodule_user`;
CREATE TABLE `wxmodule_user` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `user_pw` varchar(50) NOT NULL COMMENT '用户密码',
  `user_regdate` datetime NOT NULL COMMENT '用户注册日期',
  `user_image` varchar(500) NOT NULL COMMENT '用户头像',
  `user_status` enum('1','0') NOT NULL COMMENT '用户状态，1是启用，0是停用',
  `user_money` float(10,2) NOT NULL COMMENT '用户的金额',
  `user_module` varchar(50) NOT NULL COMMENT '用户模块',
  `user_weixin` varchar(50) NOT NULL COMMENT '用户所属微信公众号，关联weixin表weixin_token字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY user_module_id (user_id, user_module)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户表';
INSERT INTO `wxmodule_user` VALUES (1, 'admin', '管理员',  '21232f297a57a5a743894a0e4a801fc3', now(), '', '1', 0, '', '');


DROP TABLE IF EXISTS `wxmodule_weixin`;
CREATE TABLE `wxmodule_weixin` (
  `weixin_id` smallint(6) NOT NULL auto_increment,
  `weixin_number` varchar(50) NOT NULL COMMENT '公众号原始id',
  `weixin_name` varchar(50) NOT NULL COMMENT '公众号名称',
  `weixin_callbackurl` varchar(200) NOT NULL COMMENT 'api调用地址',
  `weixin_token` varchar(50) NOT NULL COMMENT 'token',
  `weixin_imgcode` varchar(50) NOT NULL COMMENT '公众号帐号二维码',
  `weixin_appid` varchar(50) NOT NULL COMMENT 'appid',
  `weixin_appsecret` varchar(50) NOT NULL COMMENT 'appsecret',
  `weixin_regdate` datetime NOT NULL COMMENT '公众号添加时间',
  `weixin_dispatchurl` varchar(200) NOT NULL COMMENT '第三方转发地址',
  PRIMARY KEY (`weixin_id`),
  UNIQUE KEY weixin_token (weixin_token)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='公众号表';


--
-- 红包模块数据库表
--
DROP TABLE IF EXISTS `wxmodule_hongbao_money`;
CREATE TABLE `wxmodule_hongbao_money` (
  `money_id` int(11) NOT NULL auto_increment,
  `money_owner` varchar(50) NOT NULL,
  `money_number` float(8,2) NOT NULL default 0,
  `money_from` varchar(50) NOT NULL COMMENT '原则上关联user表的user_id字段，当是初始资金时保存0',
  `money_time` datetime NOT NULL,
  `money_weixin` varchar(50) NOT NULL COMMENT '所属微信公众号，关联weixin表weixin_token字段',
  PRIMARY KEY (`money_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='资金表';


DROP TABLE IF EXISTS `wxmodule_hongbao_setting`;
CREATE TABLE `wxmodule_hongbao_setting` (
  `set_id` int(11) NOT NULL auto_increment,
  `set_beginmoney` int(11) unsigned NOT NULL default 10 COMMENT '初始资金',
  `set_getmoney` int(11) unsigned NOT NULL default 100 COMMENT '满足多少元可以体现',
  `set_sharemoney` float(8,2) NOT NULL default 1 COMMENT '其它用户点击时我能分享到多少钱',
  `set_untildate` date NOT NULL  COMMENT '活动截止日期',
  `set_weixin_msg` varchar(255) NOT NULL  COMMENT '微信显示',
  `set_error_msg` varchar(255) NOT NULL  COMMENT '出错显示',
  `set_share_msg` varchar(255) NOT NULL  COMMENT '微信分享显示',
  `set_invite_msg` varchar(255) NOT NULL  COMMENT '邀请好友显示',
  `set_tixian_nomoney` varchar(255) NOT NULL  COMMENT '未满提现金额时点击提取显示',
  `set_tixian_dateuntil` varchar(255) NOT NULL  COMMENT '活动截止点击提取显示',
  `set_weixin` varchar(50) NOT NULL COMMENT '红包所属微信公众号，关联weixin表weixin_token字段',
  PRIMARY KEY (`set_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='设置表';
INSERT INTO `wxmodule_hongbao_setting` VALUES (1, 10, 100, 1, now(), '', '', '', '', '', '');


DROP TABLE IF EXISTS `wxmodule_hongbao_tixian`;
CREATE TABLE `wxmodule_hongbao_tixian` (
  `tx_id` int(11) NOT NULL auto_increment,
  `tx_userid` varchar(50) NOT NULL,
  `tx_name` varchar(50) NOT NULL  COMMENT '收款姓名',
  `tx_phone` varchar(50) NOT NULL  COMMENT '手机号码',
  `tx_type` enum('1','2') NOT NULL COMMENT '提现方式，1是支付宝，2是银行卡',
  `tx_card` varchar(50) NOT NULL  COMMENT '提现帐号或卡号',
  `tx_number` varchar(50) NOT NULL  COMMENT '提现金额',
  `tx_date` datetime NOT NULL  COMMENT '提现日期',
  `tx_status` enum('0','1') NOT NULL COMMENT '提现状态，1是以发钱，0是未发钱',
  `tx_weixin` varchar(50) NOT NULL COMMENT '提现所属微信公众号，关联weixin表weixin_token字段',
  PRIMARY KEY (`tx_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='提现表';


--
-- 投票模块数据库表
--
DROP TABLE IF EXISTS `wxmodule_vote`;
CREATE TABLE `wxmodule_vote` (
  `vote_id` int(11) NOT NULL auto_increment,
  `title` varchar(100) NOT NULL  COMMENT '比赛主题',
  `timeTxt` varchar(100) NOT NULL  COMMENT '比赛时间',
  `host` varchar(100) NOT NULL  COMMENT '比赛主办方',
  `weibo_send` varchar(50) NOT NULL,
  `info` text NOT NULL  COMMENT '比赛详情',
  `fromUser` varchar(50) NOT NULL  COMMENT '真实姓名',
  `fromPhone` varchar(50) NOT NULL COMMENT '联系手机',
  `fromWeixin` varchar(50) NOT NULL COMMENT '微信或QQ',
  PRIMARY KEY (`vote_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='投票表';


DROP TABLE IF EXISTS `wxmodule_vote_baoming`;
CREATE TABLE `wxmodule_vote_baoming` (
  `bm_id` int(11) NOT NULL auto_increment,
  `username` varchar(100) NOT NULL  COMMENT '真实姓名',
  `phone` varchar(100) NOT NULL  COMMENT '手机',
  `weixin` varchar(100) NOT NULL  COMMENT '微信',
  `province` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `weibo_send1` varchar(50) NOT NULL,
  `weibo_send2` varchar(50) NOT NULL,
  `weibo_send3` varchar(50) NOT NULL,
  `matmv` varchar(50) NOT NULL  COMMENT '美拍、优酷视频，可粘贴视频网址',
  `kouhao` varchar(50) NOT NULL COMMENT '参赛口号',
  `beizhu` varchar(50) NOT NULL COMMENT '备注，附加说明',
  `baoming_date` datetime NOT NULL  COMMENT '报名日期',
  `total_piao` int(11) unsigned NOT NULL  COMMENT '总票数',
  `vote_id` int(11) unsigned NOT NULL COMMENT '报名所在投票',
  PRIMARY KEY (`bm_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='报名表';


DROP TABLE IF EXISTS `wxmodule_vote_piao`;
CREATE TABLE `wxmodule_vote_piao` (
  `piao_id` int(11) NOT NULL auto_increment,
  `bm_id` int(11) unsigned NOT NULL  COMMENT '被投票人id',
  `toupiao_user` varchar(100) NOT NULL  COMMENT '投票人',
  `piao_date` datetime NOT NULL  COMMENT '投票日期',
  `vote_id` int(11) unsigned NOT NULL COMMENT '报名所在投票',
  PRIMARY KEY (`piao_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='票数表';