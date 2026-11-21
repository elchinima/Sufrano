namespace Sufrano.Application.Interfaces;

public interface IPaymentEncryptionService
{
    string Encrypt(string plainText);
    string Decrypt(string cipherText);
}
