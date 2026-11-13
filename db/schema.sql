create table if not exists reports (
    id          serial primary key,
    rider_id    text not null,
    lat         double precision not null check (lat between -90 and 90),
    lng         double precision not null check (lng between -180 and 180),
    kind        text not null check (kind in ('close_pass', 'dooring', 'left_hook', 'pedestrian', 'surface', 'other')),
    note        text check (char_length(note) <= 280),
    occurred_at timestamptz not null,
    created_at  timestamptz not null default now()
);

create index if not exists reports_lat_lng on reports (lat, lng);
