# Stage 1: Build backend (.NET 10)
FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0 AS backend-builder
WORKDIR /src
COPY server/ .
RUN dotnet publish Rednest.Api/Rednest.Api.csproj -c Release -o /app/publish

# Stage 2: Final image — .NET serves API and static frontend (HTML, CSS, JS)
FROM mcr.microsoft.com/dotnet/nightly/aspnet:10.0 AS final
WORKDIR /app

COPY --from=backend-builder /app/publish .
COPY src/ ./wwwroot/

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV DOTNET_hostBuilder:reloadConfigOnChange=false
CMD ["dotnet", "Rednest.Api.dll"]
