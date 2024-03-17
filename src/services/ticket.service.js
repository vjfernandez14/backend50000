
const Ticket = require('../models/ticket.model');

const generateTicket = async (cart,user) => {
  try {  
    
    const purchaseDateTime = new Date();
    const amount = calculateTotalAmount(cart.products);
    console.log(user)
    const purchaser = cart._id; 
    console.log(purchaseDateTime)
    console.log(cart)
    // Crear un nuevo ticket
    const newTicket = new Ticket({
      code: generateUniqueCode(), 
      purcharse_datetime: purchaseDateTime,
      amount: amount, 
      purchaser: purchaser,
      products: cart.products.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }))
    });

  
    await newTicket.save();

    console.log('Ticket generado:', newTicket);

    return newTicket;
  } catch (error) {
    console.error('Error al generar el ticket:', error);
    throw new Error('Error al generar el ticket');
  }
};


const calculateTotalAmount = (products) => {
  let total = 0;
  products.forEach(item => {
    console.log(item.productId.price)
    total += item.productId.price * item.quantity;
  });
  return total;
};


const generateUniqueCode = () => {
    // Generar un código aleatorio utilizando caracteres alfanuméricos
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

module.exports = generateTicket