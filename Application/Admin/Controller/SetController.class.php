<?php
namespace Admin\Controller;

class SetController extends BaseController {
    
    public function viewAction() {
        $setting = M("hongbao_setting");
        $setinfo = $setting->where('set_id = 1')->find();
        $this->assign('setinfo', $setinfo);
        $this->display();
    }

    public function saveAction(){
        $setting = M("hongbao_setting");
        $post = filterAllParam('post');
        $setinfo = $setting->where('set_id = 1')->find();
        if ($setinfo) {
            $isok = $setting->where('set_id=1')->save($post);
        } else {
            $isok = $setting->add($post);
        }
        if ($isok) {
            $this->success('保存成功');
        } else {
            $this->error("保存失败");
        }
    }
}