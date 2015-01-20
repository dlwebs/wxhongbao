<?php
namespace Home\Controller;

class VoteController extends BaseController {

    private $app_id = 'wxc43356a7940e32d4';

    private $app_secret = 'ec234926610a429dfaca36328af9b014';
    
    public function indexAction() {
        $this->display();
    }
    
    public function gotoOauthAction() {
        $voteid = I('get.voteid');
        $redirect_url = urlencode('http://'.$_SERVER['SERVER_NAME'].'/index.php/showvote/'.$voteid.'/piao?from=singlemessage&isappinstalled=0');
        $gotourl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$this->app_id.'&redirect_uri='.$redirect_url.'&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect';
        redirect($gotourl);
    }
    
    public function addpiaoAction() {
        $bmid = I('get.bmid');
        if (!$bmid) {
            echo '无此参赛人';exit;
        }
        $userid = $_SESSION['user_id'];
        if (!$userid) {
            echo '没有授权';exit;
        }
        $piao = M("piao");
        $baoming = M("baoming");
        $bminfo = $baoming->where('bm_id = "'.$bmid.'"')->find();
        if (!$bminfo) {
            echo '查无此人';exit;
        }
        $istou = $piao->where('bm_id = "'.$bmid.'" and toupiao_user = "'.$userid.'"')->count();
        if ($istou) {
            echo '您已投过此人，不可重复投';exit;
        }
        
        $piaoid = $piao->add(array('bm_id'=>$bmid, 'toupiao_user'=>$userid, 'piao_date'=>date('Y-m-d H:i:s'), 'vote_id'=>$bminfo['vote_id']));
        if ($piaoid) {
            $baoming->where('bm_id = "'.$bmid.'"')->setInc('total_piao', 1);
            echo '投票成功';exit;
        } else {
            echo '投票失败';exit;
        }
    }
    
    public function showVoteAction() {
        $voteid = I('get.voteid');
        $sortby = I('get.sortby');
        
        require_once  APP_PATH."Common/Common/jssdk.php";
        $jssdk = new \JSSDK($this->app_id, $this->app_secret);
        $signPackage = $jssdk->GetSignPackage();

        $refresh_token = session('refresh_token');
        $code = I('get.code');
        if (!$refresh_token) {
            if (!$code) {
                $this->redirect('gotoOauth', array('voteid' => $voteid));
            }
            $url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$this->app_id."&secret=".$this->app_secret."&code=".$code."&grant_type=authorization_code";
            $json_content = file_get_contents($url);
            $json_obj = json_decode($json_content, true);
            session(array('name'=>'access_token_id', 'expire'=>$json_obj['expires_in']));
            session('refresh_token', $json_obj['refresh_token']);
        } else {
            $url ="https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=".$this->app_id."&grant_type=refresh_token&refresh_token=".$refresh_token;
            $json_content = file_get_contents($url);
            $json_obj = json_decode($json_content, true);
        }
        $_SESSION['user_id'] = $json_obj['openid'];
        if (!$_SESSION['user_id']) {
            session('refresh_token', null);
            $this->redirect('gotoOauth', array('voteid' => $voteid));
        }

        $vote = M("Vote");
        $voteinfo = $vote->where('vote_id = "'.$voteid.'"')->find();
        if (!$voteinfo) {
            $this->error("无此投票", U('vote/index'));
        }
        $this->assign('voteinfo', $voteinfo);
        
        $piao = M("piao");
        $total_piao = $piao->where('vote_id = "'.$voteid.'"')->count();
        $this->assign('total_piao', $total_piao);
        $baoming = M("baoming");
        if (!$sortby || $sortby == 'new') {
            $orderby = 'baoming_date desc';
        } else {
            $orderby = 'total_piao desc';
        }
        $count = $baoming->where('vote_id = "'.$voteid.'"')->count();
        $page = new \Think\Page($count, 18);
        $bmlist = $baoming->where('vote_id = "'.$voteid.'"')->limit($page->firstRow.','.$page->listRows)->order($orderby)->select();
        $show = $page->show();
        $this->assign('page', $show);
        $this->assign('total_baoming', $count);
        $this->assign('bmlist', $bmlist);
        $this->assign( 'signPackage',$signPackage);
        $this->assign('sortby', $sortby);
        $this->display();
    }
    
    public function saveVoteAction() {
        $isdelimage = I('post.delweibo_send');
        if ($isdelimage) {
            $_POST['weibo_send'] = '';
            unlink('./upload/'.$isdelimage);
        }
        if ($_FILES['weibo_send']['name']) {
            $upload = new \Think\Upload();
            $upload->maxSize = 3145728;//3M
            $upload->exts = array('jpg', 'gif', 'png', 'jpeg');
            $upload->rootPath = './upload/';
            $uploadinfo = $upload->uploadOne($_FILES['weibo_send']);
            if(!$uploadinfo) {
                $this->error($upload->getError());
            }
            $_POST['weibo_send'] = $uploadinfo['savepath'].$uploadinfo['savename'];
        }
        $vote = M("Vote");
        $post = filterAllParam('post');
        if (isset($post['vote_id']) && $post['vote_id']) {
            unset($post['delweibo_send']);
            $voteid = $vote->where('vote_id="'.$post['vote_id'].'"')->save($post);
        } else {
            $voteid = $vote->add($post);
        }
        if ($voteid) {
            $this->success('保存成功', U('vote/showVote', array('voteid'=>$voteid)));
        } else {
            $this->error("保存失败");
        }
    }

    public function baomingAction() {
        $voteid = I('get.voteid');
        $this->assign('voteid', $voteid);
        $this->display();
    }

    public function savebmAction() {
        if ($_FILES['weibo_send1']['name']) {
            $upload = new \Think\Upload();
            $upload->maxSize = 3145728;//3M
            $upload->exts = array('jpg', 'gif', 'png', 'jpeg');
            $upload->rootPath = './upload/';
            $uploadinfo = $upload->uploadOne($_FILES['weibo_send1']);
            if(!$uploadinfo) {
                $this->error($upload->getError());
            }
            $_POST['weibo_send1'] = $uploadinfo['savepath'].$uploadinfo['savename'];
        }
        if ($_FILES['weibo_send2']['name']) {
            $upload = new \Think\Upload();
            $upload->maxSize = 3145728;//3M
            $upload->exts = array('jpg', 'gif', 'png', 'jpeg');
            $upload->rootPath = './upload/';
            $uploadinfo = $upload->uploadOne($_FILES['weibo_send2']);
            if(!$uploadinfo) {
                $this->error($upload->getError());
            }
            $_POST['weibo_send2'] = $uploadinfo['savepath'].$uploadinfo['savename'];
        }
        if ($_FILES['weibo_send3']['name']) {
            $upload = new \Think\Upload();
            $upload->maxSize = 3145728;//3M
            $upload->exts = array('jpg', 'gif', 'png', 'jpeg');
            $upload->rootPath = './upload/';
            $uploadinfo = $upload->uploadOne($_FILES['weibo_send3']);
            if(!$uploadinfo) {
                $this->error($upload->getError());
            }
            $_POST['weibo_send3'] = $uploadinfo['savepath'].$uploadinfo['savename'];
        }
        $baoming = M("baoming");
        $post = filterAllParam('post');
        unset($post['area']);
        $post['baoming_date'] = date('Y-m-d H:i:s');
        $baomingid = $baoming->add($post);
        if ($baomingid) {
            $this->success('报名成功', U('vote/showVote', array('voteid'=>$post['vote_id'])));
        } else {
            $this->error("报名失败");
        }
    }
}
