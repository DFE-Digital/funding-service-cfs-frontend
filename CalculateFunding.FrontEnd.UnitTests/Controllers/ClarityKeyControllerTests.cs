using CalculateFunding.Frontend.Controllers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Threading.Tasks;

namespace CalculateFunding.Frontend.UnitTests.Controllers
{
    [TestClass]
    public class ClarityKeyControllerTests
    {
        private IConfiguration _configuration;

        [TestInitialize]
        public void Initialize()
        {
            _configuration = Substitute.For<IConfiguration>();
        }

        [TestMethod]
        public async Task GetClarityKey_ReturnsExpectedResult()
        {
            var expectedKey = "TestClarityKey";
            _configuration["clarityKey"].Returns(expectedKey);
            var controller = new ClarityKeyController(_configuration);

            var result = await controller.GetClarityKey();

            if (expectedKey != null)
            {
                result.Should().BeOfType<OkObjectResult>()
                      .Which.Value.Should().BeEquivalentTo(new { clarityKey = expectedKey });
            }
            else
            {
                result.Should().BeOfType<NotFoundObjectResult>();
            }
        }
    }
}
