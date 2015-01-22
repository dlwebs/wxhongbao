<?php
namespace Admin\Controller;

class MoneyController extends BaseController {
    
    public function listAction() {
        $hongbao = M("hongbao_setting");
        $weixin = M("weixin");
        $count = $hongbao->count();
        $page = new \Think\Page($count, 10);
        $hblist = $hongbao->order('set_id desc')->limit($page->firstRow.','.$page->listRows)->select();
        $pageinfo = $page->show();
        $hongbaolist = array();
        foreach ($hblist as $value) {
            $wxinfo = $weixin->field('weixin_name')->where('weixin_token = "'.$value['set_weixin'].'"')->find();
            $value['weixin_name'] = $wxinfo['weixin_name'];
            $hongbaolist[] = $value;
        }
        $this->assign('hblist', $hongbaolist);
        $this->assign('page', $pageinfo);
        $this->display();
    }
    
    public function modhongbaoAction() {
        $hbid = I('get.hbid');
        $hongbao = M("hongbao_setting");
        $hbinfo = $hongbao->where('set_id = "'.$hbid.'"')->find();
        if (!$hbinfo) {
            $this->error("红包不存在");
        }
        $weixin = M("weixin");
        $wxlist = $weixin->field('weixin_name, weixin_token')->select();
        $this->assign('wxlist', $wxlist);
        $this->assign('setinfo', $hbinfo);
        $this->display();
    }
    
    public function settingAction() {
        $weixin = M("weixin");
        $wxlist = $weixin->field('weixin_name, weixin_token')->select();
        $this->assign('wxlist', $wxlist);
        $this->display();
    }

    public function saveAction(){
        $post = filterAllParam('post');
        $hongbao = M("hongbao_setting");
        if (!isset($post['set_id']) || !$post['set_id']) {
            $hbnumber = $hongbao->where('set_weixin = "'.$post['set_weixin'].'"')->count();
            if ($hbnumber) {
                $this->error("一个公众号只能设置一个红包");
            }
        }

        if (isset($post['set_id']) && $post['set_id']) {
            $isok = $hongbao->where('set_id="'.$post['set_id'].'"')->save($post);
        } else {
            $isok = $hongbao->add($post);
        }
        if ($isok) {
            $this->success('保存成功', 'list');
        } else {
            $this->error("保存失败");
        }
    }

    public function txlistAction() {
        $tixian = M("hongbao_tixian");
        $userobj = M("user");
        $count = $tixian->count();
        $page = new \Think\Page($count, 20);
        $txlist = $tixian->order('tx_date desc')->limit($page->firstRow.','.$page->listRows)->select();
        $tixian_list = array();
        foreach ($txlist as $value) {
            $userinfo = $userobj->where('user_id = "'.$value['tx_userid'].'"')->find();
            $value['user_status'] = ($userinfo['user_status'] == '1') ? '已关注' : '取消关注';
            $value['user_regdate'] = $userinfo['user_regdate'];
            $tixian_list[] = $value;
        }
        $show = $page->show();
        $this->assign('page',$show);
        $this->assign('txlist', $tixian_list);
        $this->display();
    }

    public function txdetailAction() {
        $tx_id = I('get.id');
        $tixian = M("hongbao_tixian");
        $txinfo = $tixian->where('tx_id = "'.$tx_id.'"')->find();
        if (!$txinfo) {
            $this->error("未知的提现申请");
        }
        $this->assign('txinfo', $txinfo);
        $this->display();
    }

    public function modtxAction() {
        $tx_id = I('get.id');
        $tixian = M("hongbao_tixian");
        $txinfo = $tixian->where('tx_id = "'.$tx_id.'"')->find();
        if (!$txinfo) {
            $this->error("未知的提现申请");
        }
        $isok = $tixian->where('tx_id = "'.$tx_id.'"')->setField('tx_status', '1');
        if($isok){
            $this->success('状态修改成已转账');
        } else {
            $this->error('状态修改失败');
        }
    }

}