import { Handler } from 'express'
import  Item from '../models/item'

export const get: Handler = (req, res, next) => {
    let params:object = {
        type: req.params.itemType ? req.params.itemType : undefined,
        name: req.params.itemName ? req.params.itemName : undefined
    }
    // this one is a flag that, if true, makes the controller return a single object instead of an array
    let findOne:boolean = req.params.findOne || false;
    Item.find(params)
        .then(items => {
            if (findOne) {
                return res.status(200).json({ item: items[0] });
            } else {
                return res.status(200).json({ items });
            }     
        })
        .catch(err => {
            return res.json({ statusCode: 500, error: true, errormessage: err });
        })
}

export const create: Handler = (req, res, next) => {
    Item.create({
        name: req.body.itemName,
        price: req.body.itemPrice,
        type: req.body.itemType
    })
        .then(item => {
            return res.status(200).json({ item });
        })
        .catch(err => {
            return res.json({ statusCode: 500, error: true, errormesage: err });
        })
}

export const update: Handler = (req, res, next) => { 
	res.status(501);
}

export const remove: Handler = (req, res, next) => {
	Item.findOneAndDelete({
        name: req.params.itemName
    })
        .then(item => {
            return res.status(200).json({ item });
        })
        .catch(err => {
            return res.json({ statusCode: 500, error: true, errormesage: err });
        })
}