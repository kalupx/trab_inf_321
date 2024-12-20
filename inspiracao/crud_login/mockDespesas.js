const despesas = [
    {
        descricao: "Compra de material de escritório",
        valor: 200.50,
        tipoDePagamento: "Dinheiro", 
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Aluguel do mês",
        valor: 1500.00,
        tipoDePagamento: "Pix/Débito",  
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Compra de café",
        valor: 50.00,
        tipoDePagamento: "Crédito", 
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Internet e telefone",
        valor: 300.00,
        tipoDePagamento: "Pix/Débito",
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Manutenção de computador",
        valor: 400.75,
        tipoDePagamento: "Dinheiro", 
        data: new Date(),
        userId: 1
    }
]; //mock de despesas

module.exports = despesas;