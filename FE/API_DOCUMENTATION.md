# API Layer Documentation

Esta documentação descreve a camada de API completa criada para o frontend, incluindo serviços, mappers, tipos e hooks personalizados.

## 🏗️ Estrutura da Arquitetura

```
lib/
├── api/
│   └── index.ts           # Ponto de entrada principal da API
├── types/                 # Definições de tipos TypeScript
│   ├── index.ts          # Re-exports de todos os tipos
│   ├── common.types.ts   # Tipos comuns (BaseEntity, ApiResponse, etc.)
│   ├── user.types.ts     # Tipos relacionados a usuários
│   ├── product.types.ts  # Tipos relacionados a produtos
│   └── ...               # Outros tipos específicos de domínio
├── mappers/              # Mappers para transformação de dados
│   ├── index.ts          # Re-exports de todos os mappers
│   ├── user.mapper.ts    # Mapper para dados de usuários
│   ├── product.mapper.ts # Mapper para dados de produtos
│   └── ...               # Outros mappers
├── services/             # Serviços de API
│   ├── index.ts          # Re-exports de todos os serviços
│   ├── http-client.ts    # Cliente HTTP base
│   ├── user.service.ts   # Serviço de usuários
│   ├── product.service.ts# Serviço de produtos
│   └── ...               # Outros serviços
├── hooks/                # Hooks personalizados
│   └── use-api-call.ts   # Hooks para chamadas de API
└── examples/             # Exemplos de uso
    └── api-usage-examples.tsx
```

## 🚀 Início Rápido

### 1. Configuração Básica

```typescript
import api from '@/lib/api'

// Configurar token de autenticação
api.auth.setToken('your-jwt-token')

// Usar qualquer serviço
const users = await api.users.getAll()
const products = await api.products.getAll()
```

### 2. Usando com Hooks (Recomendado)

```typescript
import { useApiCall, useMutation } from '@/lib/hooks/use-api-call'
import api from '@/lib/api'

function MyComponent() {
  // Buscar dados automaticamente
  const { data: users, loading, error } = useApiCall(() => api.users.getAll())
  
  // Operações de mutação
  const { mutate: createUser, loading: creating } = useMutation(
    (userData) => api.users.create(userData)
  )
  
  // Render component...
}
```

## 📚 Serviços Disponíveis

### Usuários (`api.users`)
```typescript
// Listar todos os usuários
const users = await api.users.getAll()

// Buscar usuário por ID
const user = await api.users.getById('123')

// Criar usuário
const newUser = await api.users.create({
  email: 'user@example.com',
  full_name: 'User Name',
  password: 'password',
  roles: ['user']
})

// Atualizar usuário
const updatedUser = await api.users.update('123', { full_name: 'New Name' })

// Deletar usuário
await api.users.delete('123')

// Ativar/Desativar usuário
await api.users.activate('123')
await api.users.deactivate('123')
```

### Produtos (`api.products`)
```typescript
// Listar todos os produtos
const products = await api.products.getAll()

// Buscar por ID ou SKU
const product = await api.products.getById('123')
const productBySku = await api.products.getBySku('PRD001')

// Obter níveis de estoque
const stockLevels = await api.products.getStockLevels('123')

// Criar, atualizar, deletar
const newProduct = await api.products.create(productData)
const updated = await api.products.update('123', updates)
await api.products.delete('123')
```

### Armazéns (`api.warehouses`)
```typescript
const warehouses = await api.warehouses.getAll()
const warehouse = await api.warehouses.getById('123')
const stockLevels = await api.warehouses.getStockLevels('123')
```

### Lotes (`api.batches`)
```typescript
const batches = await api.batches.getAll()
const expiringBatches = await api.batches.getExpiring()
const batchesByProduct = await api.batches.getByProduct('123')
const batchesByWarehouse = await api.batches.getByWarehouse('123')
```

### Movimentações de Estoque (`api.stockMovements`)
```typescript
const movements = await api.stockMovements.getAll()
const stockOnHand = await api.stockMovements.getStockOnHand()
const productMovements = await api.stockMovements.getByProduct('123')

// Criar nova movimentação
const movement = await api.stockMovements.create({
  type: 'IN',
  product_id: '123',
  warehouse_id: '456',
  quantity: 100
})
```

### Compras (`api.purchases`)
```typescript
const purchases = await api.purchases.getAll()
const purchase = await api.purchases.getById('123')

// Criar pedido de compra
const newPurchase = await api.purchases.create({
  supplier_id: '123',
  items: [{ product_id: '456', quantity: 10, unit_price: 50 }]
})

// Receber pedido
await api.purchases.receive('123')
```

### Vendas (`api.sales`)
```typescript
const sales = await api.sales.getAll()
const salesSummary = await api.sales.getSummary()
const report = await api.sales.getReport()

// Itens de venda
const saleItems = await api.sales.getAllItems()
const itemsBySale = await api.sales.getItemsBySale('123')
```

### Produção (`api.production`)
```typescript
// Receitas
const recipes = await api.production.getAllRecipes()
const recipe = await api.production.getRecipeById('123')

// Lotes de produção
const batches = await api.production.getAllBatches()
const batch = await api.production.getBatchById('123')
```

### Notificações (`api.notifications`)
```typescript
// Regras de notificação
const rules = await api.notifications.getAllRules()
const rule = await api.notifications.getRuleById('123')

// Logs de notificação
const logs = await api.notifications.getAllLogs()
const logsByRule = await api.notifications.getLogsByRule('123')
```

## 🔧 Hooks Personalizados

### `useApiCall`
Hook para chamadas de API com gerenciamento de estado automático:

```typescript
const { data, loading, error, execute, reset } = useApiCall(
  () => api.users.getAll(),
  {
    immediate: true, // Executar automaticamente (padrão: true)
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error)
  }
)
```

### `useMutation`
Hook para operações de mutação (criar, atualizar, deletar):

```typescript
const { mutate, loading, error, reset } = useMutation(
  (userData) => api.users.create(userData),
  {
    onSuccess: (newUser) => {
      toast.success('Usuário criado com sucesso!')
      refetchUsers()
    },
    onError: (error) => toast.error(error.message)
  }
)

// Usar
await mutate({ email: 'test@test.com', ... })
```

### `useErrorHandler`
Hook para tratamento padronizado de erros:

```typescript
const { getErrorMessage } = useErrorHandler()

// Em um catch ou onError
const friendlyMessage = getErrorMessage(error)
```

## 🗺️ Mappers

Os mappers transformam dados entre API e frontend, fornecendo validação e formatação:

```typescript
import { UserMapper } from '@/lib/mappers'

// Validar dados antes de enviar
const validation = UserMapper.validate(userData)
if (!validation.isValid) {
  console.log('Erros:', validation.errors)
}

// Formatar para exibição
const displayUser = UserMapper.toDisplayUser(user)
```

Cada mapper possui métodos padrão:
- `fromApiResponse(apiData)` - Converter resposta da API para tipo local
- `toApiRequest(localData)` - Converter dados locais para envio à API
- `fromApiResponseArray(apiArray)` - Converter array de respostas
- `toDisplay*(data)` - Formatar para exibição
- `validate(data)` - Validar dados

## ⚙️ Configuração

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Cliente HTTP
O cliente HTTP pode ser configurado globalmente:

```typescript
import { httpClient } from '@/lib/services/http-client'

// Configurar timeout global
httpClient.timeout = 15000

// Configurar headers globais
httpClient.defaultHeaders['X-Custom-Header'] = 'value'
```

## 🔒 Autenticação

```typescript
// Configurar token
api.auth.setToken(token)

// Remover token
api.auth.removeToken()

// O token será automaticamente incluído em todas as requisições
```

## 📝 Exemplos Práticos

### Componente de Lista de Usuários
```typescript
function UsersList() {
  const { data: users, loading, error, execute: refetch } = useApiCall(
    () => api.users.getAll()
  )
  
  const { mutate: deleteUser } = useMutation(
    (id: string) => api.users.delete(id),
    { onSuccess: () => refetch() }
  )

  if (loading) return <Loading />
  if (error) return <Error message={error.message} />

  return (
    <div>
      {users?.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onDelete={() => deleteUser(user.id)}
        />
      ))}
    </div>
  )
}
```

### Formulário de Criação
```typescript
function CreateUserForm() {
  const [formData, setFormData] = useState<CreateUserDto>({
    email: '',
    full_name: '',
    password: '',
    roles: ['user']
  })

  const { mutate: createUser, loading } = useMutation(
    (data: CreateUserDto) => api.users.create(data),
    {
      onSuccess: () => {
        toast.success('Usuário criado!')
        setFormData({ email: '', full_name: '', password: '', roles: ['user'] })
      }
    }
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const validation = UserMapper.validate(formData)
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '))
      return
    }
    
    await createUser(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar'}
      </button>
    </form>
  )
}
```

## 🚨 Tratamento de Erros

O sistema fornece tratamento automático de erros HTTP:

- **400**: Dados inválidos
- **401**: Sessão expirada  
- **403**: Sem permissão
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

```typescript
try {
  const user = await api.users.getById('123')
} catch (error) {
  if (error instanceof HttpError) {
    console.log('Status:', error.status)
    console.log('Message:', error.message)
    console.log('Data:', error.data)
  }
}
```

## 🔧 Extensibilidade

### Adicionando Novos Serviços

1. Criar tipos em `types/new-service.types.ts`
2. Criar mapper em `mappers/new-service.mapper.ts`  
3. Criar serviço em `services/new-service.service.ts`
4. Adicionar ao objeto `api` em `api/index.ts`

### Customizando o Cliente HTTP

```typescript
import { HttpClient } from '@/lib/services/http-client'

const customClient = new HttpClient({
  baseURL: 'https://api.custom.com',
  timeout: 30000,
  headers: { 'X-API-Key': 'key' }
})
```

## 📋 Checklist de Implementação

- ✅ Tipos TypeScript para todos os domínios
- ✅ Mappers com validação e transformação
- ✅ Serviços para todos os endpoints do backend
- ✅ Cliente HTTP com tratamento de erros
- ✅ Hooks personalizados para React
- ✅ Exemplos de uso completos
- ✅ Documentação detalhada
- ✅ Suporte a autenticação JWT
- ✅ Tratamento de paginação e filtros
- ✅ Sistema de interceptação de erros

## 🤝 Contribuindo

Para adicionar novos recursos ou endpoints:

1. Adicione os tipos necessários
2. Crie ou atualize o mapper correspondente
3. Implemente o serviço
4. Adicione testes se necessário
5. Atualize a documentação

Esta estrutura fornece uma base sólida e escalável para todas as integrações com a API do backend.
