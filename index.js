const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000


//config

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', async (req, res) => {
    try {
        const data = req.body;
        const nota = JSON.parse(data.note);
        const customerData = data.customer;
        const dirrecionDeEnvio = data.billing_address;
        const listProduct = data.line_items;

        let infoCustomer = {
            "address": dirrecionDeEnvio.address1,
            "cellphone": dirrecionDeEnvio.phone,
            "cellphone1": null,
            "cellphone2": null,
            "city_code": nota.city,
            "email": data.email,
            "first_name": customerData.first_name,
            "identification": dirrecionDeEnvio.company,
            "neighborhood_code": nota.neighborhood,
            "second_name": "",
            "second_surname": "",
            "state_code": nota.department,
            "surname": dirrecionDeEnvio.last_name,
        };
        let despacho = {
            "address": dirrecionDeEnvio.address1,
            "city_code": nota.city,
            "indications": "",
            "neighborhood_code": nota.neighborhood,
            "phone": dirrecionDeEnvio.phone,
            "state_code": nota.department,
            "zone_code": "00"
        };
        let orden = {
            "additional_data": [
                "",
                {
                    "label": "id_sales_origin",
                    "value": 1,
                    "data": {}
                }
            ],
            "agency_code": "01",
            "client_takes": "S",
            "client_type": "TJ",
            "delivery_date": nota.date,
            "dues": 1,
            "edit": "N",
            "fee_value": Math.round( parseInt(data.total_price) ) ,
            "initial_fee": 0,
            "original": null,
            "quote": "N",
            "seller_code": "834",
            "separate_invoices": "S",
            "session_user": "",
            "t_plan": "N",
            "user_app": "FCHARRIS",
            "value": Math.round( parseInt(data.total_price) ),
            "observation": data.name
        };
        var producto = [];

        var sequence = 0;
        listProduct.forEach((i) => {
            sequence = sequence + 10;
            let obj =  {
                "bonus_code": "",
                "discount": 0,
                "dues": 1,
                "father": 0,
                "fee_value": Math.round( parseInt(i.price) ) ,
                "gifts": [],
                "promotion_code": "",
                "quantity": i.quantity,
                "regular_value": Math.round( parseInt(i.price) ),
                "sequence": sequence,
                "sku": i.sku,
                "unit_value": Math.round( parseInt(i.price) )
            }
            producto.push(obj);
        })

        var objOrder = {
            order: orden,
            client: infoCustomer,
            products: producto,
            services: [
                {
                    "service_code": "01",
                    "service_name": "DELIVERY",
                    "service_price": nota.fee
                }
            ],
            dispatch: despacho
        };



        /* const json_book = JSON.stringify(data);
        fs.writeFileSync('./response.json', json_book, 'utf-8');
 */

        res.status(200).json( objOrder )




    } catch (error) {
        res.status(400).json({ data:  null })
    }
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))