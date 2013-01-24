using Microsoft.AspNet.SignalR;
using SignalRAuction.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRAuction.Hubs
{
    public class AuctionHub : Hub
    {
        internal static AuctionViewModel auctionViewModel = new AuctionViewModel
        {
            BidsTotal = 0,
            TimeRemaining = 30
        };

        private static IHubContext GetHubContext()
        {
            // Get a reference to all the clients for AuctionHub
            return GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
        }

        internal static void AuctionRefresh(AuctionViewModel model)
        {
            GetHubContext().Clients.All.auctionRefresh(model);
        }

        public void PlaceBid(string valueBid)
        {
            // System.Web.Helpers.Json.Encode(

            auctionViewModel.BidsTotal++;
            auctionViewModel.TimeRemaining += 10;

            //GetHubContext().Clients.All.placeBid(valueBid);

            AuctionRefresh(new AuctionViewModel { BidsTotal = auctionViewModel.BidsTotal, TimeRemaining = auctionViewModel.TimeRemaining });
        }

        public void CallRefresh()
        {
            AuctionRefresh(new AuctionViewModel { BidsTotal = auctionViewModel.BidsTotal, TimeRemaining = auctionViewModel.TimeRemaining });
        }
    }
}