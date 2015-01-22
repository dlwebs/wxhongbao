<?php
namespace Admin\Controller;

class WeixinController extends BaseController {

    public function listAction(){
        $group_id = $this->userInfo['group_id'];
        $user_id = $this->userInfo['user_id'];
        $weixin = M('weixin');
        $count = $weixin->count();
        $page = new \Think\Page($count, 20);
        $wxlist = $weixin->order('weixin_regdate')->limit($page->firstRow.','.$page->listRows)->select();
        $pageinfo = $page->show();
        $this->assign('wxlist', $wxlist);
        $this->assign('page', $pageinfo);
        $this->display();
    }

    public function addAction(){
        $randToken = \Org\Util\String::randString(10, 5);
        $callbackUrl = 'http://'.$_SERVER['SERVER_NAME'].'/index.php/api/'.$randToken;
        $this->assign('token', $randToken);
        $this->assign('callbackUrl', $callbackUrl);
        $this->display();
    }

    public function modweixinAction(){
        $weixin_id = I('get.wxid');
        $weixin = M('weixin');

        $wxinfo = $weixin->where('weixin_id = "'.$weixin_id.'"')->find();
        if (!$wxinfo) {
            $this->error('公众号不存在');
        }
        $this->assign('wxinfo', $wxinfo);
        $this->display();
    }

    public function delweixinAction(){
        $weixin_id = I('get.wxid');
        $weixin = M('weixin');
        $wxinfo = $weixin->where('weixin_id = "'.$weixin_id.'"')->find();
        if (!$wxinfo) {
            $this->error('公众号不存在');
        }
        $isok = $weixin->where('weixin_id = "'.$weixin_id.'"')->delete();
        if ($isok) {
            //todo delete resource
            $this->success('删除公众号成功');
        } else {
            $this->error('删除公众号失败');
        }
    }

    public function saveAction() {
        $post = filterAllParam('post');
        if (!$post['id'] && !$post['weixin_number']) {
            $this->error('请填写公众号原始ID');
        }
        if (!$post['weixin_callbackurl']) {
            $this->error('请填写回调地址');
        }
        if (!$post['weixin_name']) {
            $this->error('请填写公众号名称');
        }
        if (!$post['weixin_appid']) {
            $this->error('请填写AppID');
        }
        if (!$post['weixin_appsecret']) {
            $this->error('请填写AppSecret');
        }
        if (!$post['weixin_token']) {
            $this->error('请填写Token');
        }

        $weixin = M('weixin');   
        $isdelimage = $post['delweixin_imgcode'];
        if ($isdelimage) {
            $post['weixin_imgcode'] = '';
            unlink('./upload/'.$isdelimage);
        }
        if ($_FILES['weixin_imgcode']['name']) {
            $upload = new \Think\Upload();
            $upload->maxSize = 3145728;//3M
            $upload->exts = array('jpg', 'gif', 'png', 'jpeg');
            $upload->rootPath = './upload/';
            $uploadinfo = $upload->uploadOne($_FILES['weixin_imgcode']);
            if(!$uploadinfo) {
                $this->error($upload->getError());
            }
            $post['weixin_imgcode'] = $uploadinfo['savepath'].$uploadinfo['savename'];
        } else {
            if ($isdelimage) {
                $this->error('请上传公众号二维码');
            }
        }
        if ($post['weixin_dispatchtoken']) {
            $post['weixin_callbackurl'] =  'http://'.$_SERVER['SERVER_NAME'].'/index.php/api/'.$post['weixin_dispatchtoken'];
            $post['weixin_token'] = $post['weixin_dispatchtoken'];
        }
        if (isset($post['id']) && $post['id']) {
            $wx_id = $post['id'];
            unset($post['id']);
            unset($post['delweixin_imgcode']);
            $edunumber = $weixin->where('weixin_id="'.$wx_id.'"')->setField($post);
            if ($edunumber) {
                $id = $wx_id;
            } else {
                $id = '';
            }
        } else {
            $post['weixin_regdate'] = date('Y-m-d H:i:s');
            $id = $weixin->add($post);
        }
        if ($id) {
            $this->success('保存公众号成功', 'list');
        } else {
            $this->error('保存公众号失败');
        }
    }
}