<?php
namespace Admin\Controller;

use Think\Controller;

class BaseController extends Controller {

    protected $userInfo = array();

    public function __construct(){
        parent::__construct();
        $this->userInfo = session('userinfo');
        if (ACTION_NAME != 'login' && ACTION_NAME != 'dologin') {
            if(empty($this->userInfo)){
                $this->display('Index:login');
                exit;
            }
        }
        $this->assign('current_m', MODULE_NAME);
        $this->assign('current_c', CONTROLLER_NAME);
        $this->assign('current_a', ACTION_NAME);
    }
}