
DROP TABLE IF EXISTS `hongbao_user`;
CREATE TABLE `hongbao_user` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `user_pw` varchar(50) NOT NULL COMMENT '用户密码',
  `user_regdate` datetime NOT NULL COMMENT '用户注册日期',
  `user_image` varchar(500) NOT NULL COMMENT '用户头像',
  `user_status` enum('1','0') NOT NULL COMMENT '用户状态，1是启用，0是停用',
  `user_money` float(10,2) NOT NULL COMMENT '用户的金额',
  PRIMARY KEY (`id`),
  UNIQUE KEY user_id (user_id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户表';
INSERT INTO `hongbao_user` VALUES (1, 'admin', '管理员',  '21232f297a57a5a743894a0e4a801fc3', now(), '', '1', 0);


DROP TABLE IF EXISTS `hongbao_money`;
CREATE TABLE `hongbao_money` (
  `money_id` int(11) NOT NULL auto_increment,
  `money_owner` varchar(50) NOT NULL,
  `money_number` float(8,2) NOT NULL default 0,
  `money_from` varchar(50) NOT NULL COMMENT '原则上关联user表的user_id字段，当是初始资金时保存0',
  `money_time` datetime NOT NULL,
  PRIMARY KEY (`money_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='资金表';


DROP TABLE IF EXISTS `hongbao_setting`;
CREATE TABLE `hongbao_setting` (
  `set_id` int(11) NOT NULL auto_increment,
  `set_beginmoney` int(11) unsigned NOT NULL default 10 COMMENT '初始资金',
  `set_getmoney` int(11) unsigned NOT NULL default 168 COMMENT '满足多少元可以体现',
  `set_sharemoney` float(8,2) NOT NULL default 0.5 COMMENT '其它用户点击时我能分享到多少钱',
  `set_untildate` date NOT NULL  COMMENT '活动截止日期',
  PRIMARY KEY (`set_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='设置表';
INSERT INTO `hongbao_setting` VALUES (1, 10, 200, 5, now());


DROP TABLE IF EXISTS `hongbao_tixian`;
CREATE TABLE `hongbao_tixian` (
  `tx_id` int(11) NOT NULL auto_increment,
  `tx_userid` varchar(50) NOT NULL,
  `tx_name` varchar(50) NOT NULL  COMMENT '收款姓名',
  `tx_phone` varchar(50) NOT NULL  COMMENT '手机号码',
  `tx_type` enum('1','2') NOT NULL COMMENT '提现方式，1是支付宝，2是银行卡',
  `tx_card` varchar(50) NOT NULL  COMMENT '提现帐号或卡号',
  `tx_number` varchar(50) NOT NULL  COMMENT '提现金额',
  `tx_date` datetime NOT NULL  COMMENT '提现日期',
  `tx_status` enum('0','1') NOT NULL COMMENT '提现状态，1是以发钱，0是未发钱',
  PRIMARY KEY (`tx_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='提现表';

=================================================================================================

DROP TABLE IF EXISTS `hongbao_vote`;
CREATE TABLE `hongbao_vote` (
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


DROP TABLE IF EXISTS `hongbao_baoming`;
CREATE TABLE `hongbao_baoming` (
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


DROP TABLE IF EXISTS `hongbao_piao`;
CREATE TABLE `hongbao_piao` (
  `piao_id` int(11) NOT NULL auto_increment,
  `bm_id` int(11) unsigned NOT NULL  COMMENT '被投票人id',
  `toupiao_user` varchar(100) NOT NULL  COMMENT '投票人',
  `piao_date` datetime NOT NULL  COMMENT '投票日期',
  `vote_id` int(11) unsigned NOT NULL COMMENT '报名所在投票',
  PRIMARY KEY (`piao_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='票数表';