#!/bin/bash

set -e

echo "🚀 Iniciando configuração do container..."

echo "📦 Instalando dependências..."
npm install

echo "🔄 Aguardando banco de dados..."
while ! pg_isready -h db -p 5432 -U postgres -q; do
  echo "Aguardando PostgreSQL..."
  sleep 2
done

echo "✅ Banco de dados conectado!"

echo "🔨 Fazendo build da aplicação..."
node ace build

echo "🗄️  Executando migrations..."
node ace migration:run

echo "🌱 Executando seeders..."
node ace db:seed

echo "🎉 Configuração concluída! Iniciando a aplicação..."

exec node build/bin/server.js
