-- schema.sql
-- OptiFlow Database Schema
-- Designed for Supabase (PostgreSQL)

-- Enable TimescaleDB extension for hyper-tables
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 1. Static Data: Zones
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    max_capacity INTEGER NOT NULL,
    coordinates TEXT -- Storing simple coordinates or JSON objects
);

-- 2. Time-Series Data: Telemetry
-- We don't need a primary key here since hyper-tables optimize query paths via time indices
CREATE TABLE telemetry (
    timestamp TIMESTAMPTZ NOT NULL,
    zone_id INTEGER REFERENCES zones(id),
    headcount INTEGER NOT NULL,
    flow_rate INTEGER NOT NULL
);

-- Convert the 'telemetry' table to a hyper-table partitioned by the 'timestamp' column
SELECT create_hypertable('telemetry', 'timestamp');

-- 3. Action Logs: Incidents
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    zone_id INTEGER REFERENCES zones(id),
    action_taken TEXT NOT NULL
);

-- Insert Seed Data to ensure relationships are valid for the generator
INSERT INTO zones (name, max_capacity, coordinates) VALUES
('North Entrance', 2000, '{"lat": 40.7128, "lng": -74.0060}'),
('Main Hall', 10000, '{"lat": 40.7129, "lng": -74.0061}'),
('VIP Lounge', 500, '{"lat": 40.7130, "lng": -74.0062}');
