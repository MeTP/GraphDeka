<?php

/* @var $this yii\web\View */
use app\controllers\SiteController;
use app\models\Node;
$this->title = 'My Yii Application';
?>
<div class="site-index container ">

    <div class="center ">
        <div class="row small-gutter" >
            <div class="col-sm-3" >
                <div class="grey-block">
                    <div class="block"><button name="addBtn" type="button" class="btn btn-default btn-block">Добавить</button></div>
                </div>
                <div class="grey-block">
                    <div class="block"><button name="deleteBtn" type="button" class="btn btn-default btn-block">Удалить </button></div>
                    <div class="block"><input value="Node" size="3" id="node-delete" class="form-control block"></div>
                </div>
                <div class="grey-block">
                    <div class="block"><button name="pathBtn" type="button" class="btn btn-default btn-block">Показать путь </button></div>
                    <div class="block"><input value="A" id="a-node-path" class="form-control"></div>
                    <div class="block"><input value="B" id="b-node-path" class="form-control"></div>
                </div>
                <div class="grey-block">
                    <div class="block"><button name="connectBtn" type="button" class="btn btn-default btn-block">Соединить/Изменить </button></div>
                    <div class="block"><input value="A" size="1" id="a-node-connect" class="form-control"></div>
                    <div class="block"><input value="B" size="1" id="b-node-connect" class="form-control"></div>
                    <div class="block"><input value="Weight" size="3" id="weight" class="form-control"></div>
                </div>
            </div>
            <div class="col-sm-8">
                <canvas id="viewport" width="800" height="600" style="border: 1px solid black; border-radius: 5px;">
                    <img id="vertexPic" src="/assets/img/vertex.gif">
                </canvas>
            </div>
        </div>
    </div>








</div>



<!--<div class="site-index">-->
<!---->
<!--    <div class="center ">-->
<!--        <div class="block row small-gutter" >-->
<!--            <div class="col-sm-3"> <button name="addBtn" type="button" class="btn btn-default btn-block">Добавить</button></div>-->
<!--            <div class="col-md-9"></div>-->
<!--        </div>-->
<!--        <div class="block row small-gutter">-->
<!--            <div class="col-sm-3"><button name="deleteBtn" type="button" class="btn btn-default btn-block">Удалить </button></div>-->
<!--            <div class="col-sm-3"><input value="Node" size="3" id="node-delete" class="form-control"></div>-->
<!--            <div class="col-md-6"></div>-->
<!--        </div>-->
<!--        <div class="block row small-gutter">-->
<!--            <div class="col-sm-3"><button name="pathBtn" type="button" class="btn btn-default btn-block">Показать путь </button></div>-->
<!--            <div class="col-sm-3"><input value="A" id="a-node-path" class="form-control"></div>-->
<!--            <div class="col-sm-3"><input value="B" id="b-node-path" class="form-control"></div>-->
<!--            <div class="col-md-3"></div>-->
<!--        </div>-->
<!--        <div class="block row small-gutter">-->
<!--            <div class="col-sm-3 " ><button name="connectBtn" type="button" class="btn btn-default btn-block">Соединить/Изменить </button></div>-->
<!--            <div class="col-sm-3"><input value="A" size="1" id="a-node-connect" class="form-control"></div>-->
<!--            <div class="col-sm-3"><input value="B" size="1" id="b-node-connect" class="form-control"></div>-->
<!--            <div class="col-sm-3"><input value="Weight" size="3" id="weight" class="form-control"></div>-->
<!--        </div>-->
<!--        <canvas id="viewport" width="800" height="600" style="border:1px solid #000000;">>-->
<!--            <img id="vertexPic" src="/assets/img/node.gif">-->
<!--        </canvas>-->
<!--    </div>-->
<!---->
<!---->
<!---->
<!--</div>-->