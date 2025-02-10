# API Paths

## Impersonate

## `/statistics`
- `GET /heatmap`: { latitude: number, longitude: number, count: number }[]
- `GET /toll/:toll_id/:start_date/:end_date`: { (Toll Document), avg_passes: 
  number, { operator: string, passes: number }[] (if same or admin, for all), 
  my_passes: number (if other) }
    - JWT-gnostic

## `/payments`
- `POST /addpasses`: Όπως το `/admin/addpasses`
    - JWT-gnostic

## `/db`
- CRUD:
    - `GET /tolls`: Toll Document []
    - `GET /tolls/:id`: Toll Document
- `GET /tolls/by_operator/:operator_id`: Return all tolls that refer to specific 
  operator
