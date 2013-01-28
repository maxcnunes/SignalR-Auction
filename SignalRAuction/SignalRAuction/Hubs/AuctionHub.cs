using Microsoft.AspNet.SignalR;
using SignalRAuction.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace SignalRAuction.Hubs
{
    public class AuctionHub : Hub
    {

        public static bool initialized = false;
        public static object initLock = new object();
        static private Timer timer;
        static private int counter = 0;
        static public AuctionViewModel auctionViewModel;
        public static int secs_10 = 10000;

        public AuctionHub()
        {
            if (initialized)
                return;

            lock (initLock)
            {
                if (initialized)
                    return;

                // Initialize model
                auctionViewModel = new AuctionViewModel(0, 10, DateTime.Now.AddSeconds(30), 0);

                timer = new System.Threading.Timer(TimerExpired, null, secs_10, 0);

                initialized = true;
            }
        }

        private static IHubContext GetHubContext()
        {
            // Get a reference to all the clients for AuctionHub
            return GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
        }

        internal static void AuctionRefresh(AuctionViewModel model)
        {
            GetHubContext().Clients.All.auctionRefresh(model);
        }

        public void PlaceBid(string valueBid, string user)
        {
            auctionViewModel.PlaceBid(decimal.Parse(valueBid), user);

            CallRefresh();

            NotifyNewBid(user, decimal.Parse(valueBid));
        }

        public void CallRefresh()
        {
            AuctionRefresh(auctionViewModel);
        }

        public void NotifyNewBid(string user, decimal value)
        {
            Clients.All.notifyNewBid(string.Format("{0} did a new bid of {1:c} at {2:T}", user, value, DateTime.Now));
        }

        public void Notify(object obj)
        {
            AddMessage("THREAD");
        }

        public void Init()
        {
            Clients.All.addMessage("Initialised");
        }

        public void AddMessage(string msg)
        {
            Clients.All.addMessage(msg);
        }

        public void TimerExpired(object state)
        {
            if (auctionViewModel.TimeRemaining > 0)
            {
                AddMessage(string.Format("Push message from server {0} - {1:hh\\:mm\\:ss}", counter++, auctionViewModel.GetTimeRemaining()));

                timer.Change(secs_10, 0);
            }
            else
            {
                timer.Dispose();
                AddMessage("Time Expired");
            }
        }
    }
}