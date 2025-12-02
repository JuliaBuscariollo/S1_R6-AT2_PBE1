## API Reference

### MODELO ENTIDADE RELACIONAMENTO

![MODELO ENTIDADE RELACIONAMENTO](./MER.png)

### Clientes

#### GET /clientes

- **Descrição** : Obtém uma lista de clientes
- **Response**: Array de clientes
- **Filtros**:

```
	GET /clientes?idCliente=1D4635A2-4E72-47D2-BE34-29E2021388E1
```

#### POST /clientes

- **Descrição** : Cria um novo cliente
- **Body** :

```
{
	"nomeCliente" : "livia",
	"cpfCliente" : "12345599298",
	"telCliente": "055019911993713",
	"emailCliente" : "livia@gmail",
	"enderecoCliente" : "tititlalalalalalati"
}
```

- **Response**:

```
{
	"message": "Cliente cadastrado com sucesso!"
}
```

- **Error Response**:

```
{
	"erro": "CPF ou Email já cadastrado!"
}

```
- **Error Response**:
```
{
	"erro": "Erro ao atualizar cliente"
}
```

#### PUT /clientes/:idCliente

- **Descrição**: Atualiza um cliente já existente
- **Body**:

```
{
    "idCliente": "22E18449-C800-484C-9253-0A0A5D361414",
	"nomeCliente": "livia",
	"cpfCliente": "12345599298",
	"telCliente": "055019911993713",
	"emailCliente": "livia@gmail",
	"enderecoCliente": "tititlalalalalalati"
	}
```

- **Response**:

```
{
    "message":"Cliente atualizado com sucesso!"
}
```

#### DELETE /clientes /:idCliente

- **Descrição**: Deleta o cliente com base no Id
- **Response**:

```
{
    "message":"Cliente deletado com sucesso!"
}
```

### Pedidos

#### GET /pedidos

- **Descrição** : Obtém uma lista de pedidos
- **Response** : Array de pedidos

#### POST /pedidos

- **Descrição** : Cria um novo pedido
- **Body** :

```
{

 {
  "idCliente": "1D4635A2-4E72-47D2-BE34-29E2021388E1",
  "dataPedido": "2025-11-31",
  "tipoEntrega": "urgente",
  "distancia": 10,
  "pesoCarga": 16,
  "valorKm": 9,
  "valorKg": 3.5
}
}
```

- **Response**:

```
{
    "message": "Pedido criado com sucesso!"
}
```

#### PUT /pedidos/:idPedido

-**Descrição**: Atualiza um pedido já existente -**Body**:

```
{
	"statusEntrega": "em transito"
}
```

-**Response**:

```
{
    "message":"Pedido atualizado com sucesso!"
}
```

#### DELETE /pedidos /:idPedido

- **Descrição**: Deleta o pedido com base no Id
- **Response**:

```
{
    "message":"Pedido deletado com sucesso!"
}
```

### Entregas

#### GET /entregas

- **Descrição** : Obtém uma lista de entregas
- **Response** : Array de entregas
