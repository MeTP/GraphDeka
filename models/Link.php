<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "link".
 *
 * @property integer $id
 * @property integer $id_a
 * @property integer $id_b
 * @property double $weight_ab
 * @property double $weight_ba
 *
 * @property Node $idA
 * @property Node $idB
 */
class Link extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'link';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_a', 'id_b', 'weight_ab', 'weight_ba'], 'required'],
            [['id_a', 'id_b'], 'integer'],
            [['weight_ab', 'weight_ba'], 'number'],
            [['id_a'], 'exist', 'skipOnError' => true, 'targetClass' => Node::className(), 'targetAttribute' => ['id_a' => 'id']],
            [['id_b'], 'exist', 'skipOnError' => true, 'targetClass' => Node::className(), 'targetAttribute' => ['id_b' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'id_a' => 'Id A',
            'id_b' => 'Id B',
            'weight_ab' => 'Weight Ab',
            'weight_ba' => 'Weight Ba',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getNodeA()
    {
        return $this->hasOne(Node::className(), ['id' => 'id_a']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getNodeB()
    {
        return $this->hasOne(Node::className(), ['id' => 'id_b']);
    }
}
