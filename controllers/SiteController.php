<?php

namespace app\controllers;

use app\models\Link;
use app\models\Node;
use Yii;
use yii\db\Exception;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class SiteController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionData()
    {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $node = Node::find()->with(["linksA", "linksB"])->orderBy('id')->asArray()->all();
       // echo '<pre>' . print_r($node, true) . '</pre>';

        return ['nodes' => $node];
    }

    /***
     *
     */
    public function actionSaveLinks()
    {
        $data = Yii::$app->request->post();
        echo "<pre>"; print_r($data); echo "</pre>";
        $findNode = Link::find()->where(['id_a' => intval($data['a-node']), 'id_b' => intval($data['b-node'])])->one();
        if ($findNode === null) {
            $findNode = Link::find()->where(['id_a' => intval($data['b-node']), 'id_b' => intval($data['a-node'])])->one();
            if ($findNode === null &&
                (Node::find()->where(['id' => intval($data['a-node'])])->one() !==null
                    && Node::find()->where(['id' => intval($data['b-node'])])->one()) !== null) {
                $findNode = new Link();
                $findNode->id_a = intval($data['a-node']);
                $findNode->id_b = intval($data['b-node']);
                $findNode->weight_ab = $data['weight'];
                $findNode->weight_ba = -1;
            } else {
                $findNode->weight_ba = $data['weight'];
            }
        } else {
            $findNode->weight_ab = $data['weight'];
        }
        $findNode->save();
    }

    public function actionAddNodes()
    {
        $data = Yii::$app->request->post();
        echo "<pre>"; print_r($data); echo "</pre>";
        $node = new Node();
        $node->x = $data['x'];
        $node->y = $data['y'];
        $node->save();
    }

    public function actionDeleteNodes()
    {
        $data = Yii::$app->request->post();
        $findNode = Node::find()->where(['id' => intval($data['node'])])->one();
        if ($findNode !== null){
            $findNode->delete();
        }
    }

    public function actionSavePosition(){
        $data = Yii::$app->request->post();
        echo "<pre>"; print_r($data); echo "</pre>";

        $findNode = Node::find()->where(['id' => intval($data['id'])])->one();
        if ($findNode !== null) {
            $findNode->x = $data['x'];
            $findNode->y = $data['y'];
            print 'vse norm';
        }else {
            // нет такого id
        }
        $findNode->save();
    }


    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return Response
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return Response|string
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    public function addNode($numb)
    {

    }

}

