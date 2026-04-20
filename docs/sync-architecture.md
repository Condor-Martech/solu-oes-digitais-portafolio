# Arquitectura de Sincronización: GSheets → n8n → Portfólio

Este documento describe el flujo de datos automatizado para actualizar los proyectos del portafolio directamente desde Google Sheets utilizando n8n como orquestador y Apps Script como disparador.

## 📊 Diagrama de Flujo

```mermaid
sequenceDiagram
    participant GS as Google Sheets (Pestaña Proyecto)
    participant AS as Apps Script (Botón Actualizar)
    participant N8N as n8n (Orquestador)
    participant AST as Astro Server (Portfólio Hub)

    GS->>AS: Usuario pulsa botón "Sincronizar"
    AS->>N8N: POST /webhook (project_id)
    Note over AS,N8N: Incluye Auth Token
    
    N8N->>GS: Lee datos de la pestaña específica
    GS-->>N8N: Retorna JSON del Proyecto
    
    N8N->>N8N: Transforma datos a formato Astro
    
    N8N->>AST: POST /api/projects (project_data)
    Note over N8N,AST: Incluye SYNC_SECRET
    
    AST->>AST: Ejecuta upsertProject() en data/projects.json
    AST-->>N8N: 200 OK / Error
    N8N-->>AS: Resultado de la operación
    AS->>GS: Notifica éxito/error al usuario (UI)
```

---

## 🛠 Componentes

### 1. Google Sheets (Origen de Datos)
- **Estructura:** Una pestaña (sheet) por cada proyecto. El nombre de la pestaña debe coincidir con el `id` del proyecto.
- **Campos sugeridos:** `title`, `company`, `link`, `production`, `image`, `desc`, `type`.

### 2. Apps Script (Trigger)
Función a nivel de Spreadsheet que se vincula a un botón:
```javascript
function syncCurrentProject() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const projectId = sheet.getName();
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ id: projectId }),
    headers: { 'Authorization': 'Bearer YOUR_N8N_TOKEN' }
  };
  
  UrlFetchApp.fetch('https://tu-n8n.com/webhook/sync-project', options);
}
```

### 3. n8n (Orquestador)
Recibe el ID, lee el sheet correspondiente y envía un `POST` al endpoint del portafolio.

### 4. API del Portafolio (`/api/projects`)
Acepta operaciones `upsert`, `delete` y `replace_all`. Requiere el header `x-sync-token` coincidente con el `SYNC_SECRET` del servidor.

---

## 📁 Persistencia
A diferencia de versiones anteriores, el sistema ahora utiliza una **única fuente de datos local**:
- Ubicación: `/data/projects.json` (en la raíz del proyecto).
- Los cambios realizados vía sincronización son atómicos y se escriben directamente en este archivo.
