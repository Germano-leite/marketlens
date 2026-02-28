# ==========================================
# ESTÁGIO 1: Construção (Build)
# ==========================================
# Pega uma imagem oficial do Maven com Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Cria uma pasta chamada /app dentro do container
WORKDIR /app

# Copia o pom.xml primeiro e baixa as dependências
# (Isso deixa o Docker mais rápido nas próximas vezes usando cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia todo o código fonte (src) para o container
COPY src ./src

# Roda o comando do Maven para gerar o arquivo .jar (ignorando testes para ir mais rápido)
RUN mvn clean package -DskipTests

# ==========================================
# ESTÁGIO 2: Execução (Run)
# ==========================================
# Pega uma imagem super leve apenas com o Java (JRE) para rodar o app
FROM eclipse-temurin:17-jre-alpine

# Define a pasta de trabalho novamente
WORKDIR /app

# Copia APENAS o arquivo .jar final que foi gerado no Estágio 1
COPY --from=build /app/target/*.jar app.jar

# Avisa o Docker que este container vai se comunicar pela porta 8080
EXPOSE 8080

# O comando que o Docker vai rodar quando o container ligar
ENTRYPOINT ["java", "-jar", "app.jar"]