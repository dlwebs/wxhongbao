<?php
namespace Home\Controller;

use Think\Controller;

class BaseController extends Controller {
    
    protected $app_id = '';

    protected $app_secret = '';

    protected $userInfo = array();

    public function __construct(){
        parent::__construct();
        $this->userInfo = session('userinfo');
        $this->app_id = session('app_id');
        $this->app_secret = session('app_secret');
        $this->assign('current_c', MODULE_NAME);
        $this->assign('current_a', ACTION_NAME);

    }
}