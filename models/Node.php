<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "node".
 *
 * @property integer $id
 * @property double $x
 * @property double $y
 *
 * @property Link[] $links
 * @property Link[] $links0
 */
class Node extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'node';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['x', 'y'], 'required'],
            [['x', 'y'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'x' => 'X',
            'y' => 'Y',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLinksA()
    {
        return $this->hasMany(Link::className(), ['id_a' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLinksB()
    {
        return $this->hasMany(Link::className(), ['id_b' => 'id']);
    }
}
