import { Handler } from 'express'
import { Query } from 'mongoose'
import  Item from '../models/item'

export const get: Handler = (req, res, next) => {
    let type:string = req.query.itemType ? req.query.itemType : undefined;
    let name:string = req.query.itemName ? req.query.itemName : undefined;
    let subtype:string = req.body.itemSubtype ? req.body.itemSubtype : undefined;
    // this one is a flag that, if true, makes the controller return a single object instead of an array
    let findOne:boolean = req.query.findOne || false;
    let query:Query<any> = Item.find({})
    if (type) {
        query = query.where('type').equals(type);
    }
    if (subtype) {
        query = query.where('subtype').equals(subtype);
    }
    if (name) {
        query = query.where('name').equals(name);
    }
    query
        .then(items => {
            if (findOne) {
                return res.status(200).json({ item: items[0] });
            } else {
                return res.status(200).json({ items });
            }     
        })
        .catch(err => {
            return res.json({ statusCode: 500, error: true, errormessage: err });
        });
}

export const create: Handler = (req, res, next) => {
    Item.create({
        name: req.body.itemName,
        price: req.body.itemPrice,
        type: req.body.itemType,
        subtype: req.body.item.itemSubtype
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